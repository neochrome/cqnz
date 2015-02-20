#!/usr/bin/env node
'use strict';
var program = require('commander');
var path    = require('path');
var fs      = require('fs');
var util    = require('util');
var spawn   = require('child_process').spawn;
var nw      = require('nodewebkit').findpath();

var displayHotkeys = function () {
	console.log('  Hotkeys:');
	console.log();
	console.log('    ESC - close the preview window and quit.');
	console.log();
};

var themes = ['hand', 'simple'];

var displayThemes = function () {
	console.log('  Themes (default is "hand"):');
	console.log();
	themes.forEach(function (theme) {
		console.log('    %s', theme);
	});
	console.log();
};

var displayErrorAndExit = function () {
	console.error();
	console.error('  error: %s', util.format.apply(undefined, arguments));
	console.error();
	process.exit(1);
};

var validateTheme = function (theme) {
	if (themes.contains(theme)) { return theme; }
	displayErrorAndExit('theme not found: %s.', theme);
};

program
	.version(require('./package.json').version)
	.usage('[options] <file>')
	.option('-s, --theme <style>', 'specify theme, default is "hand"', validateTheme)
	.on('--help', displayHotkeys)
	.on('--help', displayThemes)
	.parse(process.argv);

if (program.args.length !== 1) { displayErrorAndExit('No single <file> specified.'); }
if (!fs.existsSync(program.args[0])) { displayErrorAndExit('<file> not found: %s', program.args[0]); }
var file = path.resolve(program.args[0]);

var env = process.env;
env.LD_LIBRARY_PATH = path.join(__dirname, 'lib/');
spawn(nw, [__dirname, program.theme || 'hand', file], { env: env });
