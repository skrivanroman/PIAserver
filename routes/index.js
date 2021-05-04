const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
    res.send('<img src="/images/test.png">')
    //res.render('index', { title: 'Express' })
})

module.exports = router
