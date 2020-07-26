module.exports = (sequelize, DataTypes) => {
    const CocktailIngredient = sequelize.define("CocktailIngredient");
    return CocktailIngredient;
  };