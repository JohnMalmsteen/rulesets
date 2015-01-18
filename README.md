rulesets
========

EI voucher project. Christmas 2014-2015

Installation instructions:

All the necessary libraries and such are in the repository so it should be as simple as copying everything into the root directory of your webserver.

The javascript specific to the project is in js/columns.js and the data that gets fed to it is in some.php which is a placeholder for however the json is going to get passed into the page.

The source of that json can be changed on line 32 of colums.js

Note: it is expecting a json with three sub arrays called actions, triggers and columns in the format that is in some.php.

Note: more types of glyph icons can be added for the different datatypes on lines 69-77 of columns.js currently we have only added cases for date, time and a default.

Our custom CSS is located in css/rulesets.css
