const { yParser, chalk } = require('@umijs/utils');
const execa = require('execa');
const { join } = require('path');
const inquirer = require('inquirer');
const getPackages = require('./utils/getPackages');

const cwd = process.cwd();
const args = yParser(process.argv.slice(2));

function printErrorAndExit(message) {
  console.error(chalk.red(message));
  process.exit(1);
}

function logStep(name) {
  console.log(`${chalk.gray('>> Release:')} ${chalk.magenta.bold(name)}`);
}

async function release() {
  // Check git status
  // if (!args.skipGitStatusCheck) {
  //   const gitStatus = execa.sync('git', ['status', '--porcelain']).stdout;
  //   if (gitStatus.length) {
  //     printErrorAndExit(`Your git status is not clean. Aborting.`);
  //   }
  // } else {
  //   logStep(
  //     'git status check is skipped, since --skip-git-status-check is supplied',
  //   );
  // }

  // Check npm registry
  logStep('check npm registry');
  const userRegistry = execa.sync('npm', ['config', 'get', 'registry']).stdout;
  if (userRegistry.includes('https://registry.yarnpkg.com/')) {
    printErrorAndExit(
      `Release failed, please use ${chalk.blue('npm run release')}.`,
    );
  }
  if (!userRegistry.includes('https://registry.npmjs.org/')) {
    const registry = chalk.blue('https://registry.npmjs.org/');
    printErrorAndExit(`Release failed, npm registry must be ${registry}.`);
  }

  // Publish
  const pkgs = getPackages();
  logStep(`publish packages: ${chalk.blue(pkgs.join(', '))}`);

  for (const [index, pkg] of pkgs.entries()) {
    const pkgPath = join(cwd, 'packages', pkg);
    const { name, private, version } = require(join(pkgPath, 'package.json'));
    // private 不发包
    if (private) {
      console.log(
        `[${index + 1}/${pkgs.length}] Skip Publish package ${name}`,
      );
      continue;
    };
    // npm view xxxx version
    const { stdout } = execa.sync('npm', ['view', name, 'version'], {
      cwd: pkgPath,
    });
    if (stdout === version) {
      console.log(
        `[${index + 1}/${pkgs.length}] Skip Publish package ${name}`,
      );
      continue;
    }
    console.log(
      `[${index + 1}/${pkgs.length}] Publish package ${name}`,
    );
    let cliArgs = ['publish'];
    // one-time password from your authenticator
    if (args.otp) {
      const { otp } = await inquirer.prompt({
        name: 'otp',
        type: 'input',
        message: 'This operation requires a one-time password:',
        validate: (msg) => !!msg,
      });
      cliArgs = cliArgs.concat(['--otp', otp]);
    }
    try {
      const { stdout } = execa.sync('npm', cliArgs, {
        cwd: pkgPath,
      });
      console.log(stdout);
    } catch (error) {
    }
  }

  logStep('sync packages to tnpm');
  // syncTNPM(pkgs);

  logStep('done');
}

release().catch((err) => {
  console.error(err);
  process.exit(1);
});
