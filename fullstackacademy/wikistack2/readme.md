# comments from swyx

updating is not yet implemented as there seem tobe some bugs in sequelize when it comes to linked models. i found a couple old github issues that indicate this is unfixed in sequelize https://github.com/sequelize/sequelize/issues/7056 and https://github.com/sequelize/sequelize/issues/3581


---

# FSA summary

Wikistack continues a trend of taking everything we have already learned, and building more on top of it. Accordingly, the workshops are becoming longer, more complex, and mixing multiple libraries and tools. However, the main emphasis this time is, of course, on Sequelize — an Object Relational Mapper (ORM) library.

There are many parts to Sequelize, and the workshop attempts to cover most of the fundamental aspects. You should definitely have gotten through setting up the app, defining your models, showing a page, and associating pages with authors. Those sections included things like integrating Nunjucks into an Express application, using Sequelize schemas / validations, registering virtuals / hooks / instance methods, and using Sequelize models and instances inside your routes.

The tagging system is a less mission-critical, more complex stretch goal demonstrating the power of Express + Sequelize working with a templating system like Nunjucks. However, being able to define Sequelize class methods, and dealing with promises, is important.

Adding markdown support was mostly just ongoing practice and synthesis of concepts, with the introduction of another virtual but not much in the way of new Sequelize concepts. We expect relatively few people to make it to the Markdown section.

# Main Takeaways

Below is a high-level overview of key Sequelize topics and workshop takeaways. See the next action for a larger, more in-depth study guide with links to docs pages.

- Sequelize models relational data (in our db) as objects with properties and methods — thus, it is an Object-Relational Mapper (ORM).
- Installing Sequelize and the additional Postgres components needed (sequelize, pg, pg-hstore)
- Creating a db instance with new Sequelize and a connection string
- Creating models with db.define(modelname, fields, options)
- Specifying schema fields (attributes)
  - Specifying attribute types, e.g. Sequelize.STRING
  - Specifying attribute validations, e.g. allowNull
  - Specifying attribute defaultValues
 - Specifying model options
  - Getters & Setters (aka virtuals)
  - Hooks, e.g. beforeValidate
 - Expanding models
  - Class methods
  - Instance methods
- Associating models
- Examples of associations and what they do, e.g. hasOne, belongsToMany etc.
  - Synchronizing models with SomeModel.sync() or db.sync()
- Using models in an Express app
  - Exporting and requiring models
  - Using a model within a route to query the db or create new instances
  - Model.create, Model.findById, Model.findAll, etc.
  - More complex queries
  - Using $in, $ne, and other operators
  - Using Eager Loading (the include syntax) to do joins
- Using instances
  - Updating an instance with instance.save or instance.update
  - Destroying an instance with instance.destroy
- Dealing with asynchronicity in Express apps
  - Using promises (many Sequelize methods return promises)
  - Using next as an error handler in Express routes
  - Sending responses once the async data is fetched