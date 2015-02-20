'use strict';
var gui      = require('nw.gui');
var chokidar = require('chokidar');
var path     = require('path');
var fs       = require('fs');
var util     = require('util');

var theme = gui.App.argv[0];
var file  = gui.App.argv[1];

var render = function (content) {
	displayError();
	document.getElementById('diagram').innerHTML = '';
	try {
		Diagram.parse(content).drawSVG('diagram', { theme: theme });
	} catch (err) {
		displayError(err.toString());
	}
};

var displayError = function(text) {
	var element = document.getElementById('error');
	element.innerText = text || '';
	//element.style.hidden;
};

var renderFile = function (file) {
	fs.readFile(file, function (err, content) {
		if (err) {
			render('Title: Error: ' + err.message);
		} else {
			render(content.toString());
		}
	});
};

gui.Window.get().show();
document.onkeyup = function (e) { if (e.keyCode == 27) { gui.App.closeAllWindows(); } };
document.title = gui.App.manifest.name + ': ' + path.basename(file);

chokidar
.watch(file)
.on('error', function (err) {
	console.log('error: %s', err.toString());
	displayError(err.toString());
})
.on('change', function (path) {
	console.log('changed: %s', path);
	renderFile(path);
})
.on('unlink', function (path) {
	console.log('deleted: %s', path);
	displayError(util.format('Title: %s was deleted', path));
})
.on('ready', function () {
	renderFile(file);
});
