'use strict';
const drawer = document.querySelector('#side-menu');
const body = document.body;

//Logo to home
const logo = document.querySelector('#logo');
logo.addEventListener('click', (evt) => {
    location.href = 'home.html';
})

function openDrawer() {
    drawer.style.visibility = 'visible';
    drawer.style.width = '70vw';
    body.style.overflow = 'hidden';
}

function closeDrawer() {
    drawer.style.visibility = 'hidden';
    drawer.style.width = '0';
    body.style.overflow = 'auto';
}

