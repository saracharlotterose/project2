module.exports = function(app) {
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
