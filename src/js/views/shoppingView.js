import {element} from './base';

export const removeExistList = (length) => {
    for(let i= 0; i < length -1  ; i++){
        const tmp = document.getElementById(window.location.hash+'shopping'+i);
        tmp.parentNode.removeChild(tmp);
    }
}
export const insertHtmlShopping = (data) => {
    //document.getElementById('#47746shopping').childNodes[1].childNodes[1].value

    
    data.forEach( (el,index) => {
        if (index !== data.length -1)
        {
        const html = `
                <li class="shopping__item" id="${window.location.hash+'shopping'+index}">
                    <div class="shopping__count">
                        <input type="number" value="${el.number}" step="${el.number}">
                        <p>${el.unit}</p>
                    </div>
                    <p class="shopping__description">${el.ingredient}</p>
                    <button class="shopping__delete btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-cross"></use>
                        </svg>
                    </button>
                </li>
        `;
        element.insertShoppingList.insertAdjacentHTML('beforeend',html);
        }
    });
};
