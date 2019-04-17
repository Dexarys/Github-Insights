var express = require('express');
var envConf = require('dotenv').config();
var mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
});


function initConnection(test) {
    try {
       connection.connect();
    } catch(e) {
        console.error("Erreur bdd connection :");
        process.exit(1);
    }
}

async function checkInfos() {

}

module.exports.initConnection = initConnection;
