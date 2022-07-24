const host =process.env.HOST
const user =process.env.USER
const password =process.env.PASSWORD
const database =process.env.DATABASE
const { promisify } = require('util');
const mysql = require('mysql');
const pool = mysql.createPool({host,user,password,database});

pool.getConnection((err, connection)=>{
    if(err){
        if(err.code==='PROTOCOL_CONNECTION_LOST') {
            console.log('Conexion perdida');
        }
        if(err.code==='ER_CON_COUNT_ERROR') {
            console.log('DEMASIADAS CONEXIONES');
        }
        if(err.code==='ECONNREFUSED') {
            console.log('CONEXION RECHAZADA');
        }
    }
    if(connection) connection.release();
    console.log('DB conectada');
    return;
});

pool.query = promisify(pool.query);

module.exports = pool;