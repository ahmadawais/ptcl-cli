#!/usr/bin/env node

const ora = require('ora');
const chalk = require('chalk');
const yellow = chalk.yellow;
const green = chalk.green;
const spinner = ora({text: ''});
const cli = require('./utils/cli.js');
const puppeteer = require('puppeteer');
const init = require('./utils/init.js');
const to = require('await-to-js').default;
const theEnd = require('./utils/theEnd.js');
const handleError = require('cli-handle-error');
const shouldCancel = require('cli-should-cancel');
const Configstore = require('configstore');
const pkgJSON = require('./package.json');
const {prompt} = require('enquirer');

(async () => {
	// CLI.
	const [input] = cli.input;
	const reboot = cli.flags.reboot;
	const xheadless = cli.flags.xheadless;
	init();
	input === 'help' && (await cli.showHelp(0));
	const configure = input === 'config';

	// Config.
	const config = new Configstore(pkgJSON.name, {});
	let user = config.get('user');
	let pass = config.get('pass');

	if ((!user && !pass) || configure) {
		const [errUsername, username] = await to(
			prompt({
				type: `input`,
				name: `username`,
				initial: `admin`,
				message: `Enter the username for 192.168.10.1?`
			})
		);
		handleError(`USERNAME`, errUsername);
		await shouldCancel(username);
		config.set('user', username.username);

		const [errPassword, password] = await to(
			prompt({
				type: `input`,
				name: `password`,
				initial: `admin`,
				message: `Enter the password for 192.168.10.1?`
			})
		);
		handleError(`PASSWORD`, errPassword);
		await shouldCancel(password);
		config.set('pass', password.password);

		// Get again.
		user = config.get('user');
		pass = config.get('pass');
	}

	spinner.start(`${yellow('BROWSER')} starting…`);
	const browser = await puppeteer.launch({
		headless: xheadless,
		userDataDir: 'data'
	});
	const page = (await browser.pages())[0];
	spinner.succeed(`${green('BROWSER')} started`);

	await page.goto('http://192.168.10.1/', {
		timeout: 15000,
		waitUntil: 'domcontentloaded'
	});

	const [errIsLoggedIn, isLoggedIn] = await to(
		page.waitFor('div[id="EasyInstall"]', {
			timeout: 3000
		})
	);

	if (!isLoggedIn) {
		spinner.start(`${yellow('LOGIN')} attempt…`);
		await page.type('#Frm_Username', user);
		await page.type('#Frm_Password', pass);
		await page.click('#LoginId');
		spinner.succeed(`${green('LOGIN')} successful`);
	}

	if (reboot) {
		spinner.start(`${yellow('REBOOT')} starting…`);
		await waitFor(1000);
		await page.click('a[title="Management"]');
		await waitFor(1000);
		await page.click('a[title="Reboot"]');
		await waitFor(1000);
		await page.click('input[id="Btn_restart"]');
		await waitFor(1000);
		await page.click('input[id="confirmOK"]');
		spinner.succeed(`${green('REBOOTING')} now…`);
	}
	// await browser.close();
	theEnd();
	await browser.close();
})();

const waitFor = async time => await new Promise(res => setTimeout(res, time));
