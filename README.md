Gihub popular repositories [![Build Status](https://travis-ci.org/joserobleda/gb-code-challenge.png?branch=master)](https://travis-ci.org/joserobleda/gb-code-challenge)
=================

## Installation:

Option 1:

1. clone this repo in any folder of your system
2. run `node server.js 3000`
3. open a web browser and go to `http://localhost:3000`


Option 2:

1. clone this repo in the root of your favorite web server
2. open a web browser and go to `http://localhost/gb-code-challenge`



## Features:

1. List github repositories of any user sorted by the number of stars/watchers (highest first)
2. Show basic repository info

## Test:

Install grunt and jasmine
`````
npm install -g grunt
npm install grunt-contrib-jasmine
npm install -g grunt-cli
npm link grunt
`````

Run `grunt jasmine`


## TODO:

* Write more tests

* Organize modules with RequireJS and AMD

    Load the views, templates, models and collections on demand, reducing first page load  
    Improves code readability and maintenance
    Better test by testing each piece in a separate context
    
* Minify the files

* Consider use [Marionette](https://github.com/marionettejs/backbone.marionette)
