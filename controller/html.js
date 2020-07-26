const router = require("express").Router();
const db = require("../models");

router.get("/cocktails", (req, res) => {
  let cocktailsPromise;

  if (!req.query.ingredients) {
    cocktailsPromise = db.Cocktail.findAll({
      include: db.Ingredient,
    }).then((cocktails) => cocktails.map((c) => c.toJSON()));
  } else {
    cocktailsPromise = db.Cocktail.findAllContainingEveryIngredient(
      req.query.ingredients.split(",")
    );
  }
  cocktailsPromise
    .then((cocktails) => {
      res.render("cocktails", { cocktails });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).end();
    });
});

module.exports = router;
