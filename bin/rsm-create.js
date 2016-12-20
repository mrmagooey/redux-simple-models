#!/usr/bin/env node
var process = require('process');
var fs = require('fs');
var path = require('path');

var args = process.argv.slice(2);
var newModelName = args[0];
if (typeof newModelName === 'undefined'){
  console.warn('Need a model name argument')
  process.exit();
}

var cwd = process.cwd();
var binPath = __dirname;
var packagePath = path.join(__dirname, '..');
var templatesPath = path.join(packagePath, 'templates');
var newModelDirectoryPath = path.join(cwd, newModelName);
// make new model directory for completed templates to be written to
fs.mkdirSync(newModelDirectoryPath)

// load each template, substitute in the name, save templates to cwd 
var templateFiles = fs.readdirSync(templatesPath);
templateFiles.map(function(tf) {
  var templateContents = fs.readFileSync(path.join(templatesPath, tf), 'utf8');
  var filledTemplate = templateContents.replace(/{{ name }}/g, newModelName)
  fs.writeFileSync(path.join(newModelDirectoryPath, tf), filledTemplate);
});

console.log(newModelName + " created");

