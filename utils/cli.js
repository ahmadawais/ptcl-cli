const meow = require('meow');
const chalk = require('chalk');
const green = chalk.green;
const yellow = chalk.yellow;
const cyan = chalk.cyan;
const dim = chalk.dim;

module.exports = meow(
	`
	Usage
	  ${green(`ptcli`)} ${cyan(`<command>`)} ${yellow(`[--option]`)}

	Commands
	  ${cyan(`config`)}                             Configure the CLI.

	Options
	  ${yellow(`--login`)}, ${yellow(`-l`)}         Login and save credentials.
	  ${yellow(`--reboot`)}, ${yellow(`-r`)}        Reboot the router.
	  ${yellow(`--xheadless`)}, ${yellow(`-x`)}     Not the headless mode.

	Examples
	  ${green(`ptcli`)} ${cyan(`config`)}
	  ${green(`ptcli`)} ${yellow(`--login`)}
	  ${green(`ptcli`)} ${yellow(`--l`)}
	  ${green(`ptcli`)} ${yellow(`--reboot`)}
	  ${green(`ptcli`)} ${yellow(`--r`)}
	  ${green(`ptcli`)} ${yellow(`--xheadless`)}
	  ${green(`ptcli`)} ${yellow(`--x`)}
`,
	{
		booleanDefault: undefined,
		hardRejection: false,
		inferType: false,
		flags: {
			login: {
				type: 'boolean',
				default: false,
				alias: 'l'
			},
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
