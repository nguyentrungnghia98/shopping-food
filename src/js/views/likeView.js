import { element } from './base';

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love').setAttribute('href', `img/icons.svg#${iconString}`);
    // icons.svg#icon-heart-outlined
};