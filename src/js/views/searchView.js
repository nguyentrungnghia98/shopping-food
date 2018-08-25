    /*  
    f2f_url:"http://food2fork.com/view/47746"
    image_url:"http://static.food2fork.com/best_pizza_dough_recipe1b20.jpg"
    publisher:"101 Cookbooks"
    publisher_url:"http://www.101cookbooks.com"
    recipe_id:"47746"
    social_rank:100
    source_url:"http://www.101cookbooks.com/archives/001199.html"
    title:"Best Pizza Dough Ever"
    */
import {element} from './base';


export const getInput = () => element.searchInput.value;

export const clearInputField = () =>{
    element.searchInput.value = '';
};
export const clearOldList = () =>{
    element.listSearchResult.innerHTML = '';
};
export const clearOldBtn = () =>{
    element.buttonDirection.innerHTML = '';
};
/* 
    title = " pizza was so delicious"
    before split = arr = ['pizza','was','so',delicious']

*/
const setLimitTitle = (title,limit = 17) => {
    let coolTitle = '';
    if (title.length > limit)
    {
        title.split(' ').reduce((cal, cur)=>{
        if (cal + cur.length <= limit){
            coolTitle += cur + ' ';
        }
        return cal + cur.length;
        },0);
        return coolTitle + '...';
    }
    return title;
};

export const viewSeachList = (el,pos = element.searchResult) => {
        const coolTitle = setLimitTitle(el.title);
        
        
        const html = `
            <li>
            <a class="results__link" href="#${el.recipe_id}" id = "#${el.recipe_id}" onclick = "hashChange(${el.recipe_id});return false;">
                <figure class="results__fig">
                    <img src="${el.image_url}" alt="${el.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${coolTitle}</h4>
                    <p class="results__author">${el.publisher}</p>
                </div>
            </a>
            </li>
        `;
        document.querySelector(pos).insertAdjacentHTML('beforeend',html);
        
        // document.getElementById(`#${el.recipe_id}`).onclick = function(){
        //     hashChange();
        //     return false;
        // };
    
    
};

export const highlightSelected = id => {    
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

const htmlButton = (prev = 0, next , maxPage = 3) => {
    if (prev === 0){
        return `<button class="btn-inline results__btn--next" data-goto="${next}">
        <span>Page ${next}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>
    </button>

        </div>`;
    }
    if (next === maxPage+1){
        return `<div class="results__pages">
            
        <button class="btn-inline results__btn--prev" data-goto="${prev}">
            <span>Page ${prev}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-left"></use>
            </svg>
        </button>`;
    }
    return `
    <div class="results__pages">
            
    <button class="btn-inline results__btn--prev" data-goto="${prev}">
        <span>Page ${prev}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-left"></use>
        </svg>
    </button>

            
    <button class="btn-inline results__btn--next" data-goto="${next}">
        <span>Page ${next}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>
    </button>

        </div>
    `;
}

export const disSearchList = (data,start = 0,prev =0 ,next= 2, limit = 10) => {
    // display the search result
    
    data.slice(start, start+limit).forEach(el => viewSeachList(el));
    // display prev,next button
    const maxPage = Math.ceil( data.length / limit);
    const html = htmlButton(prev, next,maxPage);
    element.buttonDirection.insertAdjacentHTML('beforeend',html);

}