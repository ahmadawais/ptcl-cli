const meow = require('meow');
const chalk = require('chalk');
const green = chalk.green;
const yellow = chalk.yellow;
const cyan = chalk.cyan;
const dim = chalk.dim;

module.exports = meow(
	`
	Usage
	  ${green(`ptcl-cli`)} ${cyan(`<command>`)} ${yellow(`[--option]`)}

	Commands
	  ${cyan(`config`)}                             Configure the CLI.

	Options
	  ${yellow(`--reboot`)}, ${yellow(`-r`)}        Reboot the router.
	  ${yellow(`--xheadless`)}, ${yellow(`-x`)}     Not the headless mode.

	Examples
	  ${green(`ptcl-cli`)} ${cyan(`config`)}
	  ${green(`ptcl-cli`)} ${yellow(`--login`)}
	  ${green(`ptcl-cli`)} ${yellow(`--l`)}
	  ${green(`ptcl-cli`)} ${yellow(`--reboot`)}
	  ${green(`ptcl-cli`)} ${yellow(`--r`)}
	  ${green(`ptcl-cli`)} ${yellow(`--xheadless`)}
	  ${green(`ptcl-cli`)} ${yellow(`--x`)}
`,
	{
		booleanDefault: undefined,
		hardRejection: false,
		inferType: false,
		flags: {
			reboot: {
				type: 'boolean',
				default: false,
				alias: 'r'
			},
			xheadless: {
				type: 'boolean',
				default: false,
				alias: 'x'
			}
		}
	}
);
