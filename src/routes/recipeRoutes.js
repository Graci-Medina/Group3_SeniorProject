// src/routes/recipeRoutes.js
const express = require('express');
const router = express.Router();

// authMiddleware import and routes follow
const authMiddleware = require('../server/authMiddleware');

// BUG **** -- Terminal says cannot find module. Path may be unclear -- ****
const db = require('./firebase-functions');

// GET api/recipes/saved
router.get('/saved', authMiddleware, async (req, res) => {
  try {
    const savedRecipes = await db.getSavedRecipes(req.user.uid);
    res.json(savedRecipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved recipes' });
  }
});

// POST api/recipes/save
router.post('/save', authMiddleware, async (req, res) => {
  try {
    await db.saveRecipe(req.user.uid, req.body);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// DELETE api/recipes/save/:mealId
router.delete('/save/:mealId', authMiddleware, async (req, res) => {
  try {
    await db.unsaveRecipe(req.user.uid, req.params.mealId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unsave recipe' });
  }
});

module.exports = router;
