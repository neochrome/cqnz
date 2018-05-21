#!/usr/bin/env node
'use strict';
const program = require('commander');
const path    = require('path');
const fs      = require('fs');
const { app, BrowserWindow } = require('electron');

const displayHotkeys = () => {
	console.log('  Hotkeys:');
	console.log();
	console.log('    ESC - close the preview window and quit.');
	console.log();
};

const themes = ['hand', 'simple'];

const displayThemes = () => {
	console.log('  Themes (default is "hand"):');
	console.log();
	themes.forEach((theme) => {
		console.log('    %s', theme);
	});
	console.log();
};

const displayErrorAndExit = (msg, ...args) => {
	console.error();
	console.error('  error: %s', msg, ...args);
	console.error();
	process.exit(1);
};

const validateTheme = (theme) => {
	if (themes.includes(theme)) { return theme; }
	displayErrorAndExit(`theme not found: ${theme}`);
};

program
	.version(require('./package.json').version)
	.usage('[options] <file>')
	.option('-s, --theme <theme>', 'specify theme, default is "hand"', validateTheme)
	.option('-v, --verbose', 'display additional information (use multiple time to increase)', (_, total) => total + 1, 0)
	.option('-d, --dev-tools', 'enable dev tools')
	.on('--help', displayHotkeys)
	.on('--help', displayThemes)
	.parse(process.argv);

const info = (msg, ...args) => {
	if (program.verbose > 0) {
		console.log(msg, ...args);
	}
};

const debug = (msg, ...args) => {
	if (program.verbose > 1) {
		console.log(msg, ...args);
	}
};

if (program.args.length !== 1) { displayErrorAndExit('No single <file> specified.'); }
if (!fs.existsSync(program.args[0])) { displayErrorAndExit(`<file> not found: ${program.args[0]}`); }

const file = path.resolve(program.args[0]);
info('file: %s', file);
const theme = program.theme || 'hand';
info('theme: %s', theme);

let win;
const createWindow = () => {
	win = new BrowserWindow({ center: true });
	win.setMenu(null);
	win.loadURL(`file://${__dirname}/index.html#theme=${theme}&file=${file}`);
	win.on('closed', () => win = null);
	win.webContents.on('before-input-event', (event, input) => {
		if (input.type === 'keyDown' && input.code === 'Escape') { app.quit(); }
	});
	win.webContents.once('did-finish-load', update);
	if (program.devTools) { win.webContents.openDevTools(); }
};

const update = () => {
	fs.readFile(file, (err, data) => {
		if (err) { return console.error(err); }
		win.webContents.send('content', data.toString());
	});
}

app.on('ready', () => {
	createWindow();
	fs.watch(file, (eventType, _) => {
		debug('event: %s', eventType);
		if (eventType === 'change') {
			info('changed: %s', file);
			update();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') { app.quit(); }
});

app.on('activate', () => {
	if (!win) { createWindow(); }
});
