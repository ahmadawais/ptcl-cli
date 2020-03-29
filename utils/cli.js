const meow = require('meow');
const chalk = require('chalk');
const green = chalk.hex('#A6CF39');
const yellow = chalk.yellow;

module.exports = meow(
	`
	Usage
	  ${green(`ptcl-cli`)} ${green(`<command>`)} ${yellow(`[--option]`)}

	Commands
	  ${green(`config`)}              Configure the CLI.

	Options
	  ${yellow(`--reboot`)}, ${yellow(`-r`)}        Reboot the router.
	  ${yellow(`--xheadless`)}, ${yellow(`-x`)}     Not the headless mode.
	  ${yellow(`--data`)}, ${yellow(`-d`)}          Print the stats data.
	  ${yellow(`--screenshot`)}, ${yellow(`-s`)}    Screenshot xDSL Stats to desktop.

	Examples
	  ${green(`ptcl-cli`)} ${green(`config`)}
	  ${green(`ptcl-cli`)} ${yellow(`--login`)}
	  ${green(`ptcl-cli`)} ${yellow(`-l`)}
	  ${green(`ptcl-cli`)} ${yellow(`--reboot`)}
	  ${green(`ptcl-cli`)} ${yellow(`-r`)}
	  ${green(`ptcl-cli`)} ${yellow(`--xheadless`)}
	  ${green(`ptcl-cli`)} ${yellow(`-x`)}
	  ${green(`ptcl-cli`)} ${yellow(`--screenshot`)}
	  ${green(`ptcl-cli`)} ${yellow(`-s`)}
	  ${green(`ptcl-cli`)} ${yellow(`--data`)}
	  ${green(`ptcl-cli`)} ${yellow(`-d`)}
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
			},
			screenshot: {
				type: 'boolean',
				default: false,
				alias: 's'
			},
			data: {
				type: 'boolean',
				default: false,
				alias: 'd'
			}
		}
	}
);
