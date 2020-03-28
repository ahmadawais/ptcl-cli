#!/usr/bin/env node

const ora = require('ora');
const spinner = ora({ text: '' });
const cli = require('./utils/cli.js');
const init = require('./utils/init.js');
const theEnd = require('./utils/theEnd.js');
const handleError = require('cli-handle-error');

module.exports = async () => {
	init();
	const [input] = cli.input;
	const option = cli.flags.option;
	theEnd();
};
