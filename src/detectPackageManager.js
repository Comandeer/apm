import { readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { findFile } from './utilities.js';
import { parsePackageManagerField } from './utilities.js';

const fallback = {
	name: 'npm',
	method: 'fallback'
};

async function detectPackageManager( path ) {
	const packageJSONPath = await findFile( 'package.json', path );

	if ( !packageJSONPath ) {
		return fallback;
	}

	const packageJSONContent = await readFile( packageJSONPath, 'utf8' );
	const packageJSON = JSON.parse( packageJSONContent );

	if ( packageJSON.packageManager ) {
		const { name } = parsePackageManagerField( packageJSON.packageManager );

		return {
			name,
			method: 'packageManager'
		};
	}

	const projectRoot = dirname( packageJSONPath );
	const npmLockFilePath = await findFile( 'package-lock.json', path, {
		endDir: projectRoot
	} );

	if ( npmLockFilePath ) {
		return {
			name: 'npm',
			method: 'lock-file'
		};
	}

	const pnpmLockFilePath = await findFile( 'pnpm-lock.yaml', path, {
		endDir: projectRoot
	} );

	if ( pnpmLockFilePath ) {
		return {
			name: 'pnpm',
			method: 'lock-file'
		};
	}

	const yarnLockFilePath = await findFile( 'yarn.lock', path, {
		endDir: projectRoot
	} );

	if ( yarnLockFilePath ) {
		return {
			name: 'yarn',
			method: 'lock-file'
		};
	}

	return fallback;
}

export default detectPackageManager;
