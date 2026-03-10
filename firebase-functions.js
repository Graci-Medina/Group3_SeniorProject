import { db } from './firebase-config.js';

import {
    doc, setDoc, updateDoc, getDoc, arrayUnion, arrayRemove
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

function newUser(id, name, mail, color) {
  const userData = {
    uid: id,
    displayName: name,
    email: mail,
    avatarColor: color
  }
  const user = doc(db, 'users/' + id);
  setDoc(user, userData);
}

//NOTE: If all recipes are saved to folders, have each user document contain a collection
//for folders which includes documents for each folder listing all of the ids of the recipes
//in them
//Ex: users/uid/folders/cheatfood(savedRecipes: rid, rid2, rid3)


function createFolder(id, folderName) {
  const folderData = {
    name: folderName,
    savedRecipes: []
  }
  const folder = doc(db, 'users/' + id + '/folders/' + folderName);
  setDoc(folder, folderData);
}

function saveRecipe(id, folderName, mealObj) {
  const folder = doc(db, 'users/' + id + '/folders/' + folderName);
  updateDoc(folder, {
    savedRecipes: arrayUnion(mealObj)
  });
}

function unsaveRecipe(id, folderName, mealObj) {
  const folder = doc(db, 'users/' + id + '/folders/' + folderName);
  updateDoc(folder, {
    savedRecipes: arrayRemove(mealObj)
  });
}

//NOT WORKING
/*
function getSavedRecipes(id) {
    const user = doc(db, 'users/' + id);
    const doc = await getDoc(user);

    if (doc.exists()) {
        return doc;
    }
    else {
        return "Null";
    }
}
*/

//TESTING - Aubrey
signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    //newUser(123, "Aubrey", "aubsickle@gmail.com", "#D4A5A5");
    //createFolder(123, "Meat Dishes");
    //saveRecipe(123, "Vegetarian Dishes", "testmeal");
    //unsaveRecipe(123, "Vegetarian Dishes", "testmeal");


    //document.getElementById("demo").innerHTML = getSavedRecipes(123);

});
