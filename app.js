/*
    This is the server app
    and 
    this will be the first running.

    In this, there are route point to the specific route.
*/

const express = require('express');
/*
    Getting the subcriber route by controller package
*/
const subscriber = require('./controller/subcriber');

const ejs = require('ejs');
const path = require('path');

let app = express();

app.use('/', subscriber);

/**
 * seting ejs templating system
 * view engine
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('html', require('ejs').renderFile);

/**
 * set static files
 */
app.use(express.static(path.join(__dirname,'public')));

app.listen(4000, () => {
    console.log('server is starting');
});