const express = require('express');
const Joi = require('joi');
const auth = require('../database/authentication');
const database = require('../database/db-connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const longinSchema = Joi.object().keys({
    userName: Joi.string().regex(/^[A-z0-9_]{3,50}$/).required(),
    password: Joi.string().regex(/^[A-z0-9_]{6,50}$/).required()
});

router.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;
        const { error } = longinSchema.validate({ userName, password });

        if (error) {
            res.write(`${error}`);
            res.end();
            return;
        }

        if (await auth(userName, password)) {
            const token = jwt.sign({ userName: userName }, process.env.JWT_TOKEN);
            res.header('auth-token', token);
            res.write(token);
        }
        else {
            res.write('login failed');
        }
    }
    catch (err) {
        res.write(`${err}`);
        console.log(err);
    }
    finally {
        res.end();
    }

});

router.post('/register', async (req, res) => {
    try {
        const { userName, password } = req.body;
        const { error } = longinSchema.validate({ userName, password });

        if (error) {
            res.write(`${error}`);
            res.end();
            return;
        }

        const result = await database.query(`SELECT user_name FROM users WHERE user_name = "${userName}"`);

        if (result.length != 0) {
            res.write('user name has been already taken');
            res.end();
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPasswd = await bcrypt.hash(password, salt);

        await database.query(`INSERT INTO users (user_name, passwd) VALUES ( "${userName}", "${hashedPasswd}")`);
    }
    catch (err) {
        res.write(`${err}`);
        console.log(err);
    }
    finally {
        res.end();
    }

});

module.exports = router;
