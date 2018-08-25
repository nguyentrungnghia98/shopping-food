export const element = {
    searchSubmit: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    listSearchResult: document.querySelector('.results__list'),
    searchResult: '.results__list',
    linkSearchResult: document.querySelector('.results__link'),
    insertHeadRecipe: document.querySelector('.recipe'),
    buttonDirection: document.querySelector('.results__pages'),
    insertShoppingList: document.querySelector('.shopping__list'),
    buyNowBtn: document.querySelector('.shopping__btn'),
    insertShoppingListPopUp: document.querySelector('.buy-list-item'),
    popupContent: document.querySelector('.popup-shopping'),
    deletePopUp: document.querySelector('.modal-popup__close'),
    
    
    showUpLikeList: document.querySelector('.likes__panel'),
    insertShoppingList2: document.querySelector('.buy-list-item'),
    likeList: '.likes__list'
};

export const renderLoad = parent => {
    const html = `
        <div class ="loader" > 
            <svg>
                <use href = "img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin',html);
};

export const clearLoad = ()=>{
    const loader = document.querySelector('.loader');
    loader.parentElement.removeChild(loader);
};