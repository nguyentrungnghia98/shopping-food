//global._babelPolyfill = false;
import 'idempotent-babel-polyfill';
// Global app controller
import {element,renderLoad, clearLoad} from './views/base';
// Search
import Search from './models/Search';
import * as viewSearch from './views/searchView';
// Recipe
import Recipe from './models/Recipe';
import * as recipeView from './views/recipeView';
// Shopping
import Shopping from './models/Shopping';
import * as shoppingView from './views/shoppingView';
/* Global State
- Search object
- Current recipes object
- Shopping List Object
- Liked recipes
*/
let state = [];
// -------------- Search Controller -------------
const controlSearch = async () => {
    // 1) Get query from view
    const query = viewSearch.getInput();
    //const query = 'pizza';
    if (query){
        // 2) New search object and add to state
        state.Search = new Search(query);
        // 3) Prepare UI for results
        viewSearch.clearInputField();
        viewSearch.clearOldList();
        renderLoad(element.listSearchResult);
        // 4) Search for recipes
        await state.Search.getResult();
        // 5) Render results on 
        clearLoad();
       
        //viewSearch.viewSeachList(state.Search.result);
        viewSearch.disSearchList(state.Search.result);
    }
};
//controlSearch();
element.searchSubmit.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

element.buttonDirection.addEventListener('click', e => {
   // e.preventDefault();
   const limit = 10;
   const btn = e.target.closest('.btn-inline');
   
    if (btn){
        // prepare for new page
        viewSearch.clearOldList();
        viewSearch.clearOldBtn();
        // set new page
        const valBtn = parseInt( btn.dataset.goto);
        let curPage ;
        if (btn.className.includes('results__btn--prev')){
            curPage = valBtn +1;
            viewSearch.disSearchList(state.Search.result, (curPage-2) * limit, curPage -2, curPage );
        }else
        if (btn.className.includes('results__btn--next')){
            curPage = valBtn -1;
            viewSearch.disSearchList(state.Search.result, curPage * limit, curPage  , curPage +2 );
        }
      
        
    }
});
// ----------------- Recipe Controller ----------------
const controlRecipe = async () => {
    var id = window.location.hash.replace('#','');

    if(id){
            // 1) New recipe object and add to state
             state.Recipe = new Recipe(id);
        try{
             // 2) Prepare UI for result
            recipeView.clearRecipe();
            renderLoad(element.insertHeadRecipe);
            if (state.Search){viewSearch.highlightSelected(id);}
            
            // 3) Prepare results for UI
            await state.Recipe.getRecipeByID();
            state.Recipe.getDataRecipe();
            // 4) Render results on 
            clearLoad();
            recipeView.insertHtml(state.Recipe.data);
            // 5) check exits recipe in like list
            let check = false;
            for( let i = 0 ; i< state.like.length;i++){
                if( state.like[i].recipe_id === state.Recipe.data.recipe_id)
                {
                    check = true;
                    break;
                }
            }
            if (check){
                state.Recipe.isLiked = true;
                document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#icon-heart`);
            }
            
            
            
        }
        catch (err) {
            console.log(err);
            //alert('Error processing recipe!');
        }
       
    }
};
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
//window.onhashchange = controlRecipe();

// ----------------- Shopping Controller ----------------
let controlListShopping = [];
let currentRecipeInList = -1;


const controlShopping = ()=>{
    // New shopping object
    const tmp = JSON.parse(JSON.stringify(state.Recipe.data.ingredients));
    
    state.Shopping = new Shopping(tmp);

    // Fix number
    state.Shopping.fixNumber();
    // Prepare for UI
    // Render shopping list on UI
    for(var k =0;k< controlListShopping.length; k++ ){
        if (controlListShopping[k][controlListShopping[k].length -1 ] === state.Shopping.data[state.Shopping.data.length -1]) 
        {
            currentRecipeInList = k;
            break;
        }
    }
   
    if (currentRecipeInList > -1){
        const lengthOld =   controlListShopping[currentRecipeInList].length;
        state.Shopping.data.forEach((el,index) =>{
            if (index !==  state.Shopping.data.length -1)
            {
            let check = false;
            let index ;
            for(let d = 0; d< controlListShopping[currentRecipeInList].length; d++){
                if (controlListShopping[currentRecipeInList][d].ingredient === el.ingredient){
                    check = true;
                    index = d;
                    break;
                }
            }
            
            if (check){
                controlListShopping[currentRecipeInList][index].number += el.number;
            }
            else{
                const length = controlListShopping[currentRecipeInList].length;
                const tmp1 = controlListShopping[currentRecipeInList][length -1];
                controlListShopping[currentRecipeInList] =  controlListShopping[currentRecipeInList].slice(0,length -1);
                controlListShopping[currentRecipeInList].push(el);
                controlListShopping[currentRecipeInList].push(tmp1);
            }
        }
        });
        //remove 
       shoppingView.removeExistList(lengthOld);
        // insert
        shoppingView.insertHtmlShopping(controlListShopping[currentRecipeInList]);
    }
    else {
        controlListShopping.push(state.Shopping.data);
        shoppingView.insertHtmlShopping(state.Shopping.data);
    }
    
};

//Delete All list
document.querySelector('.clear-shopping-list').addEventListener('click',()=>{
    document.querySelector('.shopping__list').innerHTML = '';
    //clear data
    controlListShopping = [];
});


const deleteItemShopping = (e)=>{
    const btn = e.target.closest('.shopping__delete');
    if (btn){
    
    const ID = btn.parentNode.id;
    if(ID){

        // delete in UI
        const tmp = document.getElementById(ID);
        tmp.parentNode.removeChild(tmp);
        // delete in controlListShopping
        const [id,stt] = ID.split('shopping');
       
        controlListShopping.forEach((el,index) => {
            if (el[el.length - 1] === id) {
                controlListShopping[index] = el.filter((val,index) => index !== parseInt(stt));
            }
            
        });
       
    }
    
    }
    
};
element.insertShoppingList.addEventListener('click',deleteItemShopping);


// Show up shopping list
element.buyNowBtn.addEventListener('click', e=> {
    // prepare for UI
    element.insertShoppingListPopUp.innerHTML = element.insertShoppingList.innerHTML;
    // add event delete item
    element.insertShoppingList2.addEventListener('click',(e)=>{
        deleteItemShopping(e);
        element.insertShoppingListPopUp.innerHTML = element.insertShoppingList.innerHTML;
    });
    // show up
    element.popupContent.classList.remove("hidden");
});
 
 element.deletePopUp.addEventListener('click', (e)=>{
    //element.popupContent.classList.add("hidden");
    element.popupContent.classList.add("hidden");
 });


 // ----------------- Like Controller ----------------
 // Use localStorage to keep like list
 // localStorage.setItem(id, data)
 // data Like  = data curren Recipe
 state.like = [];
 Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}

const controlLike = ()=> {
    let data = state.Recipe.data;
    if(!state.Recipe.isLiked){
     // Save list like
     state.like.push(data);
     localStorage.setObject('like',state.like);
     // Render list on UI
        
     viewSearch.viewSeachList(data,element.likeList);
    

    
    state.Recipe.isLiked = true;
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#icon-heart`);

    
    }
    else{
        state.Recipe.isLiked = false;
        // update UI
        document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#icon-heart-outlined`);
        const tmp = document.getElementById('#'+data.recipe_id ).parentNode;
        tmp.parentNode.removeChild(tmp);
        //updatte data
        state.like = state.like.filter(el=>el.recipe_id !== data.recipe_id);
        localStorage.setObject('like',state.like);
    }
    element.showUpLikeList.classList.add("showLikeList");
    setTimeout(function () {
        element.showUpLikeList.classList.remove("showLikeList");
      }, 1000);
    
 }
// Clear list like
 document.querySelector('.clear-like-list').addEventListener('click', ()=>{
    // clear UI
    document.querySelector('.likes__list').innerHTML = '';
    // lear data
    localStorage.setObject('like','');
});
const setDefault = () => {
    let likeList = [];
    if (localStorage.getObject('like')){
        likeList = localStorage.getObject('like');
    }
    likeList.forEach(el => viewSearch.viewSeachList(el,element.likeList));
    state.like = likeList;
};
//localStorage.clear();
setDefault();

const updateServing = (type)=>{

         // inrease the number of servings
         state.Recipe.updataNumber(type);
         document.querySelector('.recipe__info-data--people').innerHTML = state.Recipe.data.servings;
         document.querySelector('.recipe__ingredient-list').innerHTML = state.Recipe.data.ingredients.map(el =>recipeView.createIngredient(el)).join('');
         
         //createIngredient
}

element.insertHeadRecipe.addEventListener('click',e => {
    if(e.target.matches('.recipe__btn, .recipe__btn *')){
        controlShopping();
    }
    else
    if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
    else 
    if (e.target.matches('.btn-decrease, .btn-decrease *'))
    {
         updateServing('dec');
    }
    else
    if (e.target.matches('.btn-increase, .btn-increase *')){
        updateServing('inc');
    }
});

