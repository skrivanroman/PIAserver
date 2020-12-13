const db = require('./db-connection');
const bcrypt = require('bcryptjs');

async function auth(userName, password){
    
    const [{passwd}] = await db.query(`SELECT passwd FROM users WHERE user_name="${userName}"`);
    
    return await bcrypt.compare(password, passwd);
   
}

module.exports = auth;