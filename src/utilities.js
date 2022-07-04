import { readdir } from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';

async function findFile( fileName, startDir, {
	endDir = '/'
} = {} ) {
	const files = await readdir( startDir );

	if ( files.includes( fileName ) ) {
		return resolvePath( startDir, fileName );
	}

	if ( startDir === endDir ) {
		return null;
	}

	const dirUp = resolvePath( startDir, '..' );

	// If directory one level up is the same as the current on,
	// we're at / and there's nowhere to go up.
	if ( dirUp === startDir ) {
		return null;
	}

	return findFile( fileName, dirUp, {
		endDir
	} );
}

export { findFile };
