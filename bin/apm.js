#!/usr/bin/env node

/* eslint-disable no-console */

import { argv } from 'node:process';
import { cwd as processCwd } from 'node:process';
import { exit } from 'node:process';
import chalk from 'chalk';
import { execa } from 'execa';
import { hideBin } from 'yargs/helpers';
import { detectPackageManager } from '../dist/apm.mjs';

const cwd = processCwd();
const args = hideBin( argv );
const detectedPackageManager = await detectPackageManager( cwd );
const message = getDetectionMessage( detectedPackageManager );

console.warn( message );

const result = await execa( detectedPackageManager.name, args, {
	cwd,
	stdio: 'inherit',
	reject: false
} );
const exitCode = calculateExitCode( result );

exit( exitCode );

function getDetectionMessage( { name, method } ) {
	const humanReadableMethod = formatMethod( method );
	const color = method !== 'fallback' ? chalk.green : chalk.yellow;

	return color( `apm: Detected ${ name } package manager via ${ humanReadableMethod }` );
}

function formatMethod( method ) {
	if ( method === 'packageManager' ) {
		return 'packageManager field in package.json';
	} else if ( method === 'lock-file' ) {
		return 'existing lock file';
	}

	return 'fallback';
}

function calculateExitCode( result ) {
	if ( Number.isInteger( result.exitCode ) ) {
		return result.exitCode;
	}

	return Number( result.failed );
}
