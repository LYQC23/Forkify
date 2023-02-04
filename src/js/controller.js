import icons from 'url:../img/icons.svg'
console.log(icons);
import 'core-js/stable';
import 'regenerator-runtime/runtime'
import *as model from "./model.js"
import recipeView from './views/recipeView.js';
import { getJson } from './helpers.js';
import { API_URL,MODEL_CLOSE_SEC } from './config.js';

import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
// https://forkify-api.herokuapp.com/v2

if(module.hot)
{
  module.hot.accept();
}
///////////////////////////////////////
const controlRecipes = async function(){
  try{
    const id = window.location.hash.slice(1);//delete #
    if(!id) return ;
    recipeView.renderSpinner();

   //1.update results view to mark the selected
    resultsView.update(model.getSearchResultsPage())
   
 

   //2.load the recipe
    await model.loadRecipea(id);

    //3.rendering the recipe
    recipeView.render(model.state.recipe); 

    //4.update bookmarksViw
    bookmarksView.update(model.state.bookmarks)


  }catch(err){
    recipeView.renderError();
    console.error(err);
  }
  
}

const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();

    //1.get search query
    const query = searchView.getQuery();
    console.log(query);
    if(!query) return;

    //2.load search results
    await model.loadSearchResults(query);
    
    //3.render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    //4.Render initial pagination buttons
    paginationView.render(model.state.search)

  }catch(err){
  }
 
}
const controlServings = function(newServings){
  //Update the recipe serving (in state)
  model.updateServings(newServings);
  console.log(newServings);
  //Update the recview
  recipeView.update(model.state.recipe);
}
const controlPagination = function(goToPage){
  // render New results
  resultsView.render(model.getSearchResultsPage(goToPage));
  
  // render New pagination button
  paginationView.render(model.state.search)

}

const controlAddBookmark = function(){

  //1 add / delete
  if(!model.state.recipe.bookmarked)
   model.addBookmark(model.state.recipe);
  else
   model.deleteBookmark(model.state.recipe.id);

  //2.update recipeView
  recipeView.update(model.state.recipe)

  //3.render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {

  try{
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload recipe data
    await model.uploadRecipe(newRecipe);

    //render the new recipe
    recipeView.render(model.state.recipe);
    
    //Succed message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change
    window.history.pushState(null, '',  `#${model.state.recipe.id}`);
    //Close the rom window
    setTimeout(function () {
      addRecipeView.toggleWindow()
    },MODEL_CLOSE_SEC * 1000)
  }catch(err){
    console.log(err);

    addRecipeView.renderError(err.message)
  }

}

// window.addEventListener('hashchange',showRecipe);
// window.addEventListener('load',showRecipe);
const init = function(){
   recipeView.addHandlerRender(controlRecipes);
   searchView.addHandlerSearch(controlSearchResults);
   paginationView.addHandlerClick(controlPagination)
   recipeView.addHandlerUpdateServings(controlServings);
   recipeView.addHandlerAddBookmark(controlAddBookmark);
   bookmarksView.addHandlerRender(controlBookmarks);
   addRecipeView.addHandlerUpload(controlAddRecipe);
}
init()


