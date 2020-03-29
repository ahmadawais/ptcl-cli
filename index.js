#!/usr/bin/env node

const path = require('path');
const os = require('os');
const ora = require('ora');
const chalk = require('chalk');
const yellow = chalk.yellow;
const red = chalk.red;
const green = chalk.hex('#A6CF39');
const spinner = ora({text: ''});
const Table = require('cli-table3');
const {prompt} = require('enquirer');
const cli = require('./utils/cli.js');
const puppeteer = require('puppeteer');
const init = require('./utils/init.js');
const to = require('await-to-js').default;
const theEnd = require('./utils/theEnd.js');
const handleError = require('cli-handle-error');
const shouldCancel = require('cli-should-cancel');
const Configstore = require('configstore');
const pkgJSON = require('./package.json');

(async () => {
	// CLI.
	const [input] = cli.input;
	const reboot = cli.flags.reboot;
	const xheadless = cli.flags.xheadless;
	const screenshot = cli.flags.screenshot;
	const data = cli.flags.data;

	init();
	input === 'help' && (await cli.showHelp(0));
	const configure = input === 'config';

	// Should I run?
	if (!configure && !reboot && !xheadless && !screenshot & !data) {
		spinner.fail(`${red(`Nops`)} You didn't define any options to run.`);
		spinner.info(`${green(`HELP`)} section below:`);
		await cli.showHelp(0);
		console.log();
		process.exit(0);
	}

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

	spinner.start(`${yellow(`BROWSER`)} starting…`);
	const browser = await puppeteer.launch({
		headless: xheadless,
		userDataDir: 'data'
	});
	spinner.succeed(`${green(`BROWSER`)} started`);

	spinner.start(`${yellow(`PAGE`)} opening…`);
	const page = (await browser.pages())[0];
	page.setViewport({width: 1000, height: 1000, deviceScaleFactor: 2});

	await page.goto('http://192.168.10.1/', {
		timeout: 15000,
		waitUntil: 'domcontentloaded'
	});

	const [errIsLoggedIn, isLoggedIn] = await to(
		page.waitFor('div[id="EasyInstall"]', {
			timeout: 3000
		})
	);
	spinner.succeed(`${green(`PAGE`)} open`);

	if (!isLoggedIn) {
		spinner.start(`${yellow(`LOGIN`)} attempt…`);
		await page.type('#Frm_Username', user);
		await page.type('#Frm_Password', pass);
		await page.click('#LoginId');
		spinner.succeed(`${green(`LOGIN`)} successful`);
	}

	if (reboot) {
		spinner.start(`${yellow(`REBOOT`)} starting…`);
		await waitFor(800);
		await page.click('a[title="Management"]');
		await waitFor(800);
		await page.click('a[title="Reboot"]');
		await waitFor(800);
		await page.click('input[id="Btn_restart"]');
		await waitFor(800);
		await page.click('input[id="confirmOK"]');
		spinner.succeed(`${green(`REBOOTING`)} now…`);
	}

	if (screenshot) {
		spinner.start(`${yellow(`SCREENSHOTS`)} starting…`);
		const screenshotPathName = path.join(
			os.homedir(),
			'Desktop',
			`stats-xdsl-${new Date().toISOString().substring(0, 10)}.jpg`
		);
		await waitFor(800);
		await page.click('a[title="Device Info"]');
		await waitFor(800);
		await page.click('a[title="Statistics"]');
		await waitFor(800);
		await page.click('a[title="xDSL"]');
		await waitFor(800);
		await waitFor(800);
		await page.screenshot({path: screenshotPathName, type: 'jpeg'});
		spinner.succeed(`${green(`SCREENSHOTS`)} saved…`);
	}

	if (data || screenshot) {
		spinner.start(`${yellow(`DATA`)} fetching…`);

		await waitFor(800);
		await page.click('a[title="Device Info"]');
		await waitFor(800);
		await page.click('a[title="Statistics"]');
		await waitFor(800);
		await page.click('a[title="xDSL"]');
		await waitFor(800);
		const downSNR = await page.$eval(
			'td[id="Downstream_noise_margin"]',
			el => el.textContent
		);
		const upSNR = await page.$eval(
			'td[id="Upstream_noise_margin"]',
			el => el.textContent
		);
		const attainableDown = await page.$eval(
			'td[id="Downstream_max_rate"]',
			el => el.textContent
		);
		const attainableUp = await page.$eval(
			'td[id="Upstream_max_rate"]',
			el => el.textContent
		);
		const down = await page.$eval(
			'td[id="Downstream_current_rate"]',
			el => el.textContent
		);
		const up = await page.$eval(
			'td[id="Upstream_current_rate"]',
			el => el.textContent
		);
		spinner.succeed(`${green(`DATA`)} listed below:\n`);
		const table = new Table({
			head: [
				`${green(`#`)}`,
				`${green(`DOWNLOAD`)}`,
				`${green(`UPLOAD`)}`
			],
			style: {head: ['green']}
		});

		table.push([`${green(`SNR`)}`, downSNR, upSNR]);
		table.push([
			`${green(`Speed`)}`,
			`${Math.abs(down) / 1000} Mbps`,
			`${Math.abs(up) / 1000} Mbps`
		]);

		table.push([
			`${green(`Attainable`)}`,
			`${Math.abs(attainableDown) / 1000} Mbps`,
			`${Math.abs(attainableUp) / 1000} Mbps`
		]);
		console.log(table.toString());
	}
	theEnd();
	await browser.close();
})();

const waitFor = async time => await new Promise(res => setTimeout(res, time));
