'use strict';

const drawer = document.querySelector('#side-menu');
const body = document.body;

//Logo to home
const logo = document.querySelector('#logo');
logo.addEventListener('click', (evt) => {
    location.href = 'home.html';
})

function openDrawer() {
    drawer.style.display = 'flex';
    drawer.style.width = '70vw';
    body.style.overflow = 'hidden';
}

function closeDrawer() {
    drawer.style.display = 'none';
    drawer.style.width = '0';
    body.style.overflow = 'auto';
}

//settings button in drawer
const settingsBtn = document.querySelector('.drawer-settings');
if (settingsBtn) {
    settingsBtn.href = 'accountCreateExtra.html'
    settingsBtn.addEventListener('click', () => {
        if (JSON.parse(sessionStorage.getItem('user'))) {
            sessionStorage.setItem('modifying-profile', 'true')
        }
    })
}



//profile pic
const profilePic = document.querySelector('#profilePic');
const profilePicContainer = document.querySelector('#profilePicContainer');

if (sessionStorage.getItem('user')) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if(profilePic){
        profilePic.src = (user.profilePic) ? window.GLOBAL_URL + '/uploads/user/' + user.profilePic : '../images/login.png';
        profilePic.style.width = '100%';
        profilePic.style.height = '100%';
        profilePic.style.opacity = '100%';
        profilePic.style.borderRadius = '10px';
        profilePicContainer.style.border = 'none';
        profilePicContainer.style.padding = '0';
    }
}
if (profilePic) {
    profilePic.addEventListener('click', (evt) => {
        evt.preventDefault();
        location.href = (sessionStorage.getItem('user')) ? 'myProfile.html' : 'userLogin.html';
    });
}


const menuBtn = document.querySelector('#menuBtn');

if (!sessionStorage.getItem('user')) {
    menuBtn.style.visibility = 'hidden';
}