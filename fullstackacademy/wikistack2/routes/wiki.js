var express = require('express')
var router = express.Router()
var models = require('../models');
var Page = models.Page; 
var User = models.User; 

router.get('/add', function(req, res) {
  res.render('addpage');
});

router.get('/search', function(req, res) {
    // console.log('req.params', req)
    const searchTerm = req.query.tag
    Page.findByTag(searchTerm).then(function (pages) {
       res.render('tagpage', {pages: pages, searchTerm: searchTerm}) 
    });
})

router.get('/:urlTitle', function (req, res, next) {

  Page.findOne({
        where: {
            urlTitle: req.params.urlTitle
        },
        include: [
            {model: User, as: 'author'}
        ]
    })
    .then(function (page) {
        // page instance will have a .author property
        // as a filled in user object ({ name, email })
        if (page === null) {
            res.status(404).send();
        } else {
            // console.log(page.renderedContent)
            res.render('wikipage', {
                page: page,
                user: page.dataValues.author.dataValues,
                tags: page.dataValues.tags
            });
        }
    })
  .catch(next);

});
router.get("/", (req, res) => res.redirect('/'))
router.get('/:urlTitle/similar', function (req, res, next) {
    Page.findOne({
        where: {
            title: req.params.urlTitle
        }
    })
    .then(function (page) {
        page.findSimilar().then(pages => {
            res.render('index', { pages: pages })
        })
    })

});

router.get('/:urlTitle/delete', function (req, res, next) {
    Page.destroy({
        where: {
            urlTitle: req.params.urlTitle
        }
    })
    .then(res.redirect('/'))
    .catch(next)
});
router.get('/:urlTitle/edit', function (req, res, next) {
    
  Page.findOne({
        where: {
            urlTitle: req.params.urlTitle
        },
        include: [
            {model: User, as: 'author'}
        ]
    })
    .then(function (page) {
        // page instance will have a .author property
        // as a filled in user object ({ name, email })
        if (page === null) {
            res.status(404).send();
        } else {
            console.log(page.dataValues)
            res.render('editpage', {
                page: page,
                user: page.dataValues.author.dataValues,
                tags: page.dataValues.tags.join(' ')
            });
        }
    })
  .catch(next);

});
router.post('/:urlTitle/edit', function (req, res, next) {
    const updateVals = {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags.split(' ')
    }
    User.findOrCreate({
        where: {
            name: req.body.name,
            email: req.body.email
        }
    })
    .then(function (values) {

        var user = values[0];

        // var page = Page.build({
        //     title: req.body.title,
        //     content: req.body.content,
        //     tags: req.body.tags.split(' ')
        // });

        return Page.update(updateVals, {where: {urlTitle: req.query.urlTitle}}).then(function (page) {
            return page.setAuthor(user);
        });

    })
    .then(function (page) {
        res.redirect(page.route);
    })
    .catch(next);

    // Page.update(updateVals, {where: {urlTitle: req.query.urlTitle}})
    // .then((result => {
    //     console.log(result)
    //     res.redirect('/wiki/' + result.urlTitle)
    // }))
});


router.post('/', (req, res, next) => {

    User.findOrCreate({
        where: {
            name: req.body.name,
            email: req.body.email
        }
    })
    .then(function (values) {

        var user = values[0];

        var page = Page.build({
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags.split(' ')
        });

        return page.save().then(function (page) {
            return page.setAuthor(user);
        });

    })
    .then(function (page) {
        res.redirect(page.route);
    })
    .catch(next);
})


module.exports = router