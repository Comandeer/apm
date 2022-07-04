import { dirname } from 'node:path';
import { resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'ava';
import mockFS from 'mock-fs';
import detectPackageManager from '../src/detectPackageManager.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const fixtureDirPath = resolvePath( __dirname, '__fixtures__' );
const packageManagerFixturePath = resolvePath( fixtureDirPath, 'packageManager' );
const packageManagerAndLockFileFixturePath = resolvePath( fixtureDirPath, 'packageManagerAndLockFile' );
const npmLockFileFixturePath = resolvePath( fixtureDirPath, 'npmLockFile' );
const pnpmLockFileFixturePath = resolvePath( fixtureDirPath, 'pnpmLockFile' );
const yarnLockFileFixturePath = resolvePath( fixtureDirPath, 'yarnLockFile' );
const npmAndPnpmLockFileFixurePath = resolvePath( fixtureDirPath, 'npmAndPnpmLockFile' );
const npmAndYarnLockFileFixurePath = resolvePath( fixtureDirPath, 'npmAndYarnLockFile' );
const pnpmAndYarnLockFileFixurePath = resolvePath( fixtureDirPath, 'pnpmAndYarnLockFile' );
const allLockFilesFixturePath = resolvePath( fixtureDirPath, 'allLockFiles' );
const nestedFixturePath = resolvePath( fixtureDirPath, 'nestedPackageManager' );
const deepestLevelNestedFixturePath = resolvePath( nestedFixturePath, 'level1', 'level2', 'level3' );
const emptyDirPath = '/testDir/with/nested';

test.before( () => {
	mockFS( {
		[ fixtureDirPath ]: mockFS.load( fixtureDirPath ),
		[ emptyDirPath ]: {}
	} );
} );

test.after( () => {
	mockFS.restore();
} );

test( 'detectPackageManager() returns the correct package manager from packageManager field (same dir)',
	async ( t ) => {
		const expectedPackageManager = {
			name: 'yarn',
			method: 'packageManager'
		};
		const actualPackageManager = await detectPackageManager( packageManagerFixturePath );

		t.deepEqual( actualPackageManager, expectedPackageManager );
	} );

test( 'detectPackageManager() returns the correct package manager from packageManager field (nested dir)',
	async ( t ) => {
		const expectedPackageManager = {
			name: 'npm',
			method: 'packageManager'
		};
		const actualPackageManager = await detectPackageManager( deepestLevelNestedFixturePath );

		t.deepEqual( actualPackageManager, expectedPackageManager );
	} );

test( 'detectPackageManager() prefers packageManager field over lock file', async ( t ) => {
	const expectedPackageManager = {
		name: 'yarn',
		method: 'packageManager'
	};
	const actualPackageManager = await detectPackageManager( packageManagerAndLockFileFixturePath );

	t.deepEqual( actualPackageManager, expectedPackageManager );
} );

test( 'detectPackageManager() correctly detects npm lock file', async ( t ) => {
	const expectedPackageManager = {
		name: 'npm',
		method: 'lock-file'
	};
	const actualPackageManager = await detectPackageManager( npmLockFileFixturePath );

	t.deepEqual( actualPackageManager, expectedPackageManager );
} );

test( 'detectPackageManager() correctly detects pnpm lock file', async ( t ) => {
	const expectedPackageManager = {
		name: 'pnpm',
		method: 'lock-file'
	};
	const actualPackageManager = await detectPackageManager( pnpmLockFileFixturePath );

	t.deepEqual( actualPackageManager, expectedPackageManager );
} );

test( 'detectPackageManager() correctly detects yarn lock file', async ( t ) => {
	const expectedPackageManager = {
		name: 'yarn',
		method: 'lock-file'
	};
	const actualPackageManager = await detectPackageManager( yarnLockFileFixturePath );

	t.deepEqual( actualPackageManager, expectedPackageManager );
} );

test( 'detectPackageManager() prefers npm lock file over pnpm one', async ( t ) => {
	const expectedPackageManager = {
		name: 'npm',
		method: 'lock-file'
	};
	const actualPackageManager = await detectPackageManager( npmAndPnpmLockFileFixurePath );

	t.deepEqual( actualPackageManager, expectedPackageManager );
} );

test( 'detectPackageManager() prefers npm lock file over yarn one', async ( t ) => {
	const expectedPackageManager = {
		name: 'npm',
		method: 'lock-file'
	};
	const actualPackageManager = await detectPackageManager( npmAndYarnLockFileFixurePath );

	t.deepEqual( actualPackageManager, expectedPackageManager );
} );

test( 'detectPackageManager() prefers npm lock file over pnpm and yarn ones', async ( t ) => {
	const expectedPackageManager = {
		name: 'npm',
		method: 'lock-file'
	};
	const actualPackageManager = await detectPackageManager( allLockFilesFixturePath );

	t.deepEqual( actualPackageManager, expectedPackageManager );
} );

test( 'detectPackageManager() prefers pnpm lock file over yarn one', async ( t ) => {
	const expectedPackageManager = {
		name: 'pnpm',
		method: 'lock-file'
	};
	const actualPackageManager = await detectPackageManager( pnpmAndYarnLockFileFixurePath );

	t.deepEqual( actualPackageManager, expectedPackageManager );
} );

test( 'detectPackageManager() returns fallback if project root is not found', async ( t ) => {
	const expectedPackageManager = {
		name: 'npm',
		method: 'fallback'
	};
	const actualPackageManager = await detectPackageManager( emptyDirPath );

	t.deepEqual( actualPackageManager, expectedPackageManager );
} );
