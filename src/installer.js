import core from '@actions/core'
import tc from '@actions/tool-cache'
import io from '@actions/io'

async function createTempDir() {
	let tmpDir = process.env['RUNNER_TEMPDIRECTORY'] || 'tmp/'
	await io.mkdirP(tmpDir)
	core.debug(`temp directory: ${tmpDir}`)

	return tmpDir
}

function baseLocation() {
	let name = executionName()
	let base = ''

	if (process.platform === 'win32') {
		base = `${process.env['USERPROFILE']}`
	} else {
		base = `${process.env.HOME}`
	}

	return `${base}/${name}`
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

	let path = baseLocation()
	let bin = `${extracted}/${executionName()}`
	await io.mv(bin, path)
	core.addPath(path)

	return path
}