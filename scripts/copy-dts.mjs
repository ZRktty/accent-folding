import { copyFileSync } from 'node:fs';

copyFileSync('index.d.ts', 'dist/esm/index.d.ts');
copyFileSync('index.d.ts', 'dist/cjs/index.d.cts');
