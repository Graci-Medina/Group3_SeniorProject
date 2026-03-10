// Import the functions in firebase-functions.js
// BUG **** -- Terminal says cannot find module. Path may be unclear -- ****
const { saveRecipe, unsaveRecipe, getSavedRecipes } = require('./firebase-functions');

exports.getSavedRecipes = async (req, res) => {
  try {
    // req.user.uid comes from Auth Middleware
    const recipes = await getSavedRecipes(req.user.uid);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved recipes" });
  }
};

exports.saveRecipe = async (req, res) => {
  try {
    // Pass the user ID and the meal data from the request body
    await saveRecipe(req.user.uid, req.body);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save recipe" });
  }
};

exports.unsaveRecipe = async (req, res) => {
  try {
    // mealId comes from the URL: /api/recipes/save/:mealId
    await unsaveRecipe(req.user.uid, req.params.mealId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove recipe" });
  }
};
