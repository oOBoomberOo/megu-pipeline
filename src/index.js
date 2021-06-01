import core from '@actions/core'
import exec from '@actions/exec'
import { getInstaller } from './installer'

async function showVersion() {
	let output = ''

	let options = {
		listeners: {
			stdout: data => output += data.toString()
		}
	}

	let exit_code = exec.exec('megu', ['--version'], options)

	core.debug(`
	exit code: ${exit_code}
	stdout: ${output}
	`)

	return {
		exit_code,
		output,
	}
}

async function run() {
	try {
		let version = core.getInput('version', { required: true })

		core.info(`megumax version: ${version}`)
		await getInstaller(version)

		return await showVersion()
	} catch (e) {
		core.setFailed(`Action failed with error: ${e.message}`)
	}
}

run()