const pg = require('pg');

// config
require('dotenv').config();

let con = null;

exports.conection = function() {
	con = new pg.Pool({
        database: process.env.DATABASE_NAME, // postgresの接続先db名
        user: process.env.DATABASE_USER, // postgresの接続に使用するユーザー名
        password: process.env.DATABASE_PASSWORD, // postgresの接続に使用するユーザーのパスワード
        host: process.env.DATABASE_HOST, // postgresのhost名
        port: process.env.DATABASE_PORT, // postgresのport
	});

	return con;
};

exports.end = function() {
	if (con) {
		con.end();
		con = null;
	}
}