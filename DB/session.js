var session = require('express-session');
var MYSQLStore = require('express-mysql-session')(session);
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '0143',
    database: 'book_system',
};

var sessionStore = new MYSQLStore(options);

module.exports = sessionStore;