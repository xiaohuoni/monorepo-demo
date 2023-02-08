const { existsSync, writeFileSync, readdirSync } = require('fs');
const { join } = require('path');
const { yParser } = require('@umijs/utils');
const getPackages = require('./utils/getPackages');

(async() => {
    const args = yParser(process.argv);
    const version = '0.0.1';

    const pkgs = getPackages();

    pkgs.forEach((shortName) => {
        const name = shortName === 'demo' ? shortName : `@demoteam/${shortName}`;

        const pkgJSONPath = join(
            __dirname,
            '..',
            'packages',
            shortName,
            'package.json',
        );
        const pkgJSONExists = existsSync(pkgJSONPath);
        if (args.force || !pkgJSONExists) {
            const json = {
                name,
                version,
                description: name,
                main: 'lib/index.js',
                types: 'lib/index.d.ts',
                files: ['lib'],
                license: 'MIT',
                publishConfig: {
                    access: 'public',
                },
            };
            if (pkgJSONExists) {
                const pkg = require(pkgJSONPath);
                [
                    'dependencies',
                    'devDependencies',
                    'peerDependencies',
                    'bin',
                    'files',
                    'authors',
                    'types',
                    'sideEffects',
                    'main',
                    'module',
                ].forEach((key) => {
                    if (pkg[key]) json[key] = pkg[key];
                });
            }
            writeFileSync(pkgJSONPath, `${JSON.stringify(json, null, 2)}\n`);
        }

        const readmePath = join(
            __dirname,
            '..',
            'packages',
            shortName,
            'README.md',
        );
        if (args.force || !existsSync(readmePath)) {
            writeFileSync(readmePath, `# ${name}\n`);
        }
    });
})();