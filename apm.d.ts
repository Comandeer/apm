interface DetectionResult {
	name: 'npm' | 'pnpm' | 'yarn';
	method: 'packageManager' | 'lock-file' | 'fallback';
}

declare function detectPackageManager( path: string ): Promise<DetectionResult>;

export { DetectionResult };
export { detectPackageManager };
