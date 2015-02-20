# cqnz (sequence)
A Sequence Diagram previewer.
Watches a sequence diagram file for changes and updates a HTML preview.
Press ESC to close.

Read more about the syntax of sequence diagram files at [www.websequencediagrams.com](https://www.websequencediagrams.com/examples.html)

## Installation
```
$ npm install --global neochrome/cqnz
```

## Usage
#### Basic usage
```
$ cqnz my-diagram.txt
```

#### With simple theme
```
$ cqnz --theme simple my-diagram.txt
```

## Release notes
1. make sure wc is clean and all commited
2. execute: `npm version major | minor | patch`
3. execute: `git push --all; git push --tags`
4. profit
