import { dirname } from 'node:path';
import { resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'ava';
import createCmdTest from './__helpers__/createCmdTest.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const apmPath = resolvePath( __dirname, '..', 'bin', 'apm.js' );
const fixtureDirPath = resolvePath( __dirname, '__fixtures__' );
const packageManagerFixturePath = resolvePath( fixtureDirPath, 'packageManager' );
const allLockFilesFixturePath = resolvePath( fixtureDirPath, 'allLockFiles' );

test( 'calls appropriate package manager from packageManager field in package.json file', createCmdTest( {
	cmd: apmPath,
	cwd: packageManagerFixturePath,
	callback( t, { stderr } ) {
		const expectedLog = 'Detected yarn package manager via packageManager field in package.json';

		t.true( stderr.includes( expectedLog ) );
	}
} ) );

test( 'calls appropriate package manager from lock file', createCmdTest( {
	cmd: apmPath,
	cwd: allLockFilesFixturePath,
	callback( t, { stderr } ) {
		const expectedLog = 'Detected npm package manager via existing lock file';

		t.true( stderr.includes( expectedLog ) );
	}
} ) );

test( 'passes arguments alongside', createCmdTest( {
	cmd: apmPath,
	params: [
		'--version'
	],
	cwd: allLockFilesFixturePath,
	callback( t, { stdout } ) {
		const semverRegex = /^\d+\.\d+\.\d+$/;

		t.regex( stdout, semverRegex );
	}
} ) );

test( 'returns correct exit code', createCmdTest( {
	cmd: apmPath,
	params: [
		'nonexisting'
	],
	cwd: allLockFilesFixturePath,
	callback( t, { exitCode } ) {
		t.is( exitCode, 1 );
	}
} ) );
