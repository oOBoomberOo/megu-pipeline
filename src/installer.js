import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as io from '@actions/io'
import { join } from 'path'

async function createTempDir() {
	let tmpDir = process.env['RUNNER_TEMPDIRECTORY'] || 'tmp/'
	await io.mkdirP(tmpDir)
	core.debug(`temp directory: ${tmpDir}`)

	return tmpDir
}

async function baseLocation() {
	let base = ''

	if (process.platform === 'win32') {
		base = `${process.env['USERPROFILE']}/.bin`
	} else {
		base = `${process.env.HOME}/.bin`
	}

	await io.mkdirP(base)

	return base
}

function getToolUrl(version) {
	let base_url = `https://github.com/oOBoomberOo/megumax/releases/download/v${version}`

	if (process.platform === 'win32') {
		return `${base_url}/megu-windows.zip`
	} else if (process.platform === 'darwin') {
		return `${base_url}/megu-mac.zip`
	} else if (process.platform === 'linux') {
		return `${base_url}/megu-linux.tar.gz`
	}
}

function executionName() {
	if (process.platform === 'win32') {
		return `megu.exe`
	} else {
		return `megu`
	}
}

async function extract(path, dest) {
	if (process.platform === 'win32') {
		return await tc.extractZip(path, dest)
	} else if (process.platform === 'darwin') {
		return await tc.extractZip(path, dest)
	} else if (process.platform === 'linux') {
		return await tc.extractTar(path, dest)
	}
}

export async function getInstaller(version) {
	let url = getToolUrl(version)
	let dir = await createTempDir()
	let tool = await tc.downloadTool(url)
	let extracted = await extract(tool, dir)

	core.debug(`extracted tool: ${extracted}`)

	let base = await baseLocation()

	core.debug(`executable path: ${base}`)

	let bin = join(extracted, executionName())

	core.debug(`executable file: ${bin}`)

	let path = join(base, 'megu')

	await io.mv(bin, path)
	core.addPath(base)

	return path
}