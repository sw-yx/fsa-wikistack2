var express = require('express')
var router = express.Router()
router.use('/wiki', require('./wiki'))
router.use('/users', require('./user'))
var models = require('../models');
var Page = models.Page; 
var User = models.User; 

router.get('/', (req, res) => {
    Page.findAll().then(pages => {
        // console.log('pages', )
        res.render('index', {pages: pages})
    })
})

router.get('/search', (req, res) => {
    res.render('tagsearch')
})

module.exports = router