// const db = require('./db-connection');
// const bcrypt = require('bcryptjs');

// async function auth(userName, password){

//     if(/^[A-z0-9_]{3,50}$/.test(userName)){
//         try{
//             const [{passwd}] = await db.query(`SELECT passwd FROM users WHERE user_name="${userName}"`);

//              return await bcrypt.compare(password, passwd);
//         }
//         catch(err){
//             throw new Error('invalid user name');
//         }

//     }

//     throw new Error('invalid user name');

// }

// module.exports = auth;
