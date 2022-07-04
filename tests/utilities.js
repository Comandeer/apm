import { dirname } from 'node:path';
import { resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'ava';
import mockFS from 'mock-fs';
import { findFile } from '../src/utilities.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const fixtureDirPath = resolvePath( __dirname, '__fixtures__' );
const packageManagerFixturePath = resolvePath( fixtureDirPath, 'packageManager' );
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

test( 'findFile() returns the absolute path to the package.json file (same dir)', async ( t ) => {
	const fileName = 'package.json';
	const expectedPath = resolvePath( packageManagerFixturePath, fileName );
	const actualPath = await findFile( fileName, packageManagerFixturePath );

	t.is( actualPath, expectedPath );
} );

test( 'findFile() returns the absolute path to the package.json file (nested dir)', async ( t ) => {
	const fileName = 'package.json';
	const expectedPath = resolvePath( nestedFixturePath, fileName );
	const actualPath = await findFile( fileName, deepestLevelNestedFixturePath );

	t.is( actualPath, expectedPath );
} );

test( 'findFile() returns null due to limiting the search area', async ( t ) => {
	const fileName = 'package.json';
	const expectedPath = null;
	const actualPath = await findFile( fileName, deepestLevelNestedFixturePath, {
		endDir: deepestLevelNestedFixturePath
	} );

	t.is( actualPath, expectedPath );
} );

test( 'findFile() returns null if reaches / without finding package.json file', async ( t ) => {
	const resolvedProjectRoot = await findFile( 'package.json', emptyDirPath );

	t.is( resolvedProjectRoot, null );
} );
