const db = require("../models");

module.exports = function(app) {
  app.get("/", (req, res) => {
    res.render("home");
  });
  app.get("/mix", (req, res) => {
    // get all the ingredients
    db.Ingredient.findAll()
      .then(ingredients => {
        const sours = [];
        const alcohols = [];
        const sweeteners = [];
        const others = [];
        // then sort ingredients to an array by the category
        ingredients.forEach(ingredient => {
          const name =
            ingredient.name[0].toUpperCase() + ingredient.name.substr(1);
          const value = ingredient.name;
          //"alcohol", "sour", "sweetener", "other"
          if (ingredient.category === "alcohol") {
            alcohols.push({ name, value });
          } else if (ingredient.category === "sweetener") {
            sweeteners.push({ name, value });
          } else if (ingredient.category === "sour") {
            sours.push({ name, value });
          } else {
            sours.push({ name, value });
          }
        });
        // render mis with each of the arrays
        res.render("mix", { alcohols, sours, sweeteners, others });
      })
      .catch(error => {
        console.log(error);
        res.status(500).end();
      });
  });

  app.get("/cocktails", (req, res) => {
    let cocktailsPromise;
    if (!req.query.ingredients) {
      cocktailsPromise = db.Cocktail.findAll({
        include: db.Ingredient
      }).then(cocktails => cocktails.map(c => c.toJSON()));
    } else {
      cocktailsPromise = db.Cocktail.findAllContainingEveryIngredient(
        req.query.ingredients.split(",")
      );
    }
    cocktailsPromise
      .then(cocktails => {
        res.render("cocktails", { cocktails });
      })
      .catch(error => {
        console.log(error);
        res.status(500).end();
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
