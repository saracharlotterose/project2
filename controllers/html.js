const db = require("../models");

module.exports = function(app) {
  app.get("/", (req, res) => {
    res.render("home");
  });
  app.get("/mix", (req, res) => {
    // get all ingrediennts from database
    db.Ingredient.findAll().then(ingredients => {
      const alcohols = [];
      const sweeteners = [];
      const sours = [];
      ingredients.forEach(myFunction);
      function myFunction(i) {
        const name = i.name[0].toUpperCase() + i.name.substr(1);
        const value = i.name;
        if (i.category === "alcohol") {
          alcohols.push({ name, value });
        } else if (i.category === "sweetener") {
          sweeteners.push({ name, value });
        } else {
          sours.push({ name, value });
        }
      }

      res.render("mix", { alcohols, sweeteners, sours });
    });
  });
  app.get("/cocktails/:id", (req, res) => {
    res.render("cocktail-views-page");
    // update render response after views is created
    let cocktailsPromise;

    if (!req.query.id) {
      cocktailsPromise = db.Cocktail.findOne({
        include: db.id
      }).then(cocktails => cocktails.map(c => c.toJSON()));
    } else {
      cocktailsPromise = db.Cocktail.findOne(req.query.id);
    }
    cocktailsPromise
      .then(id => {
        res.render("cocktails-view-page", { id });
        // update hbs template name after views is created
      })
      .catch(error => {
        console.log(error);
        res.status(500).end();
      });
  });
};
