const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const env = require('dotenv')
const jwt = require('jsonwebtoken')

const indexRouter = require('./routes/index')
//const usersRouter = require('./routes/users')
//const imagesRouter = require('./routes/images')
const vinRouter = require('./routes/vin')

const app = express()
env.config()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.urlencoded({ limit: '500mb', extended: true }))
app.use(express.json({ limit: '500mb' }))

app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
//app.use('/users', usersRouter)
//app.use('/images', verifyUser, imagesRouter)
app.use('/vin', vinRouter)
//app.use('/vin', verifyUser, vinRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

function verifyUser(req, res, next) {
    const token = req.header('auth-token')

    if (!token) {
        res.write('Access denied')
        return res.end()
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_TOKEN)
        req.user = verified
        next()
    } catch (err) {
        res.write('Invalid token')
        res.end()
    }
}

process.on('uncaughtException', function (err) {
    console.log(err)
})
module.exports = app
