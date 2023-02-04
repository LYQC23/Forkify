import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE,KEY } from "./config";
import { AJAX, getJson ,sendJson} from './helpers.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        page: 1,
        results:[],
        resultsPerpage: RES_PER_PAGE,
    },
    bookmarks: [],
};
const createRecipeObject = function(data){
    let {recipe} = data.data;
    return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    }


}
export const loadRecipea =async function(id){
    try{
        const data = await AJAX(`${API_URL}/${id}?key=${KEY}`)

        state.recipe = createRecipeObject(data);

        if(state.bookmarks.some(bookmark=> bookmark.id === id))
            state.recipe.bookmarked =true;
        else
            state.recipe.bookmarked =false;
        console.log(state.recipe);
    }catch(err){
        console.error(`Err in Model: ${err}!!!`);
        throw err;
    }
    

}

export const loadSearchResults = async function(query){
    try{
        state.query =query;
        const data = await AJAX(`${API_URL}/?search=${query}&key=${KEY}`);
        
        state.search.results = data.data.recipes.map( recipe =>{
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && { key: recipe.key }),
            }
        });
        state.search.page = 1;
    }
    catch(err){
        throw err;
    }
}

export const getSearchResultsPage = function(page  = state.search.page){
    state.search.page = page
    const start = (page-1)*state.search.resultsPerpage;
    const end = page*state.search.resultsPerpage;

    return state.search.results.slice(start,end)
}

export const updateServings = function(newServings){
    //原料成分也需要翻倍
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });

    state.recipe.servings = newServings;
}
export const persistBookmarks = function(){
    localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks)); 
 }
export const addBookmark = function(recipe){
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
}
export const deleteBookmark = function(id){
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    if (id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
}

const init = function(){
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
}
init();

const clearBookmarks = function (params) {
    localStorage.clear('bookmarks')
}
//向API请求
export const uploadRecipe = async function (newRecipe) {

    try{
        const ingredients = Object.entries(newRecipe)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
          const ingArr = ing[1].split(',').map(el => el.trim());
          // const ingArr = ing[1].replaceAll(' ', '').split(',');
          if (ingArr.length !== 3)
            throw new Error(
              'Wrong ingredient fromat! Please use the correct format :)'
            );
  
          const [quantity, unit, description] = ingArr;
  
          return { quantity: quantity ? +quantity : null, unit, description };
        });
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
          };

        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        console.log(state.recipe);
        addBookmark(state.recipe);
    }catch(err){
        throw err;
    }

  
     
}


alert("由于数据源来自外网的API，测试正常功能需要科学上网")
  //   try {
  //     const ingredients = Object.entries(newRecipe)
  //       .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
  //       .map(ing => {
  //         const ingArr = ing[1].split(',').map(el => el.trim());
  //         // const ingArr = ing[1].replaceAll(' ', '').split(',');
  //         if (ingArr.length !== 3)
  //           throw new Error(
  //             'Wrong ingredient fromat! Please use the correct format :)'
  //           );
  
  //         const [quantity, unit, description] = ingArr;
  
  //         return { quantity: quantity ? +quantity : null, unit, description };
  //       });
  
  //     const recipe = {
  //       title: newRecipe.title,
  //       source_url: newRecipe.sourceUrl,
  //       image_url: newRecipe.image,
  //       publisher: newRecipe.publisher,
  //       cooking_time: +newRecipe.cookingTime,
  //       servings: +newRecipe.servings,
  //       ingredients,
  //     };
  
  //     const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  //     state.recipe = createRecipeObject(data);
  //     addBookmark(state.recipe);
  //   } catch (err) {
  //     throw err;
  //   }
  // };
  
