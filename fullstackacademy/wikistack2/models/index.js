const Sequelize = require('sequelize');
const marked = require('marked');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false
});

function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}

var Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false

  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  tags: {
      type: Sequelize.ARRAY(Sequelize.STRING)
  }
},
{
  getterMethods: {
    route() {
      return '/wiki/' + this.urlTitle
    },
    renderedContent() {
      // var text = this.content
      // assuming you have a `text` variable or similar to work with:
      var doubleBracketTags = /\[\[(.*?)\]\]/g;
      var rendered = marked(this.content).replace(doubleBracketTags, replacer);
      function replacer(match, innerText) {
        return '<a href="/wiki/' + generateUrlTitle(innerText) + '">' + innerText + '</a>'; // FIX THESE BY INCLUDING HTML TAG OPENERS AND CLOSERS
      }
      return rendered
      // return marked(this.content)
    }
  },
  hooks: {
    beforeValidate: (user, options) => {
      user.urlTitle = generateUrlTitle(user.title)
    }
  }
}
);


Page.findByTag = function(searchterm) {
    return Page.findAll({
        // $overlap matches a set of possibilities
        where : {
            tags: {
                $overlap: [searchterm]
            }
        }
    });
}
// Adding an instance level method
Page.prototype.findSimilar = function() {
    return Page.findAll({
        // $overlap matches a set of possibilities
        where : {
            tags: {
                $overlap: this.tags
            },
            title: {
              $ne: this.title
            }
        }
    });
};

var User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});



Page.belongsTo(User, { as: 'author' });


module.exports = {
  Page: Page,
  User: User,
  db: db
};