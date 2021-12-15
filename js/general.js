'use strict';

// const drawer = document.querySelector('#side-menu');
const body = document.body;
const user = JSON.parse(sessionStorage.getItem('user'));

//Logo to home
const logo = document.querySelector('#logo');
if (logo) {
    logo.addEventListener('click', (evt) => {
        location.href = 'home.html';
    })
}


const profilePic = document.querySelector('#profilePic');
const profilePicContainer = document.querySelector('#profilePicContainer');
if (sessionStorage.getItem('user')) {
    //profile pic

    if(profilePic){
        profilePic.src = (user.profilePic) ? window.GLOBAL_URL + '/uploads/user/' + user.profilePic : '../images/login.png';
        profilePic.style.width = '100%';
        profilePic.style.height = '100%';
        profilePic.style.opacity = '100%';
        profilePic.style.borderRadius = '200px';
        profilePic.style.objectFit = 'cover';
        profilePicContainer.style.border = 'none';
        profilePicContainer.style.padding = '0';
    }
}
if (profilePic) {
    profilePic.addEventListener('click', (evt) => {
        evt.preventDefault();
        location.href = (sessionStorage.getItem('user')) ? 'myProfile.html?id=' + user.userId : 'userLogin.html';
    });
}


const menuBtn = document.querySelector('#menuBtn');
if (menuBtn) {
    if (!sessionStorage.getItem('user')) {
        menuBtn.style.visibility = 'hidden';
    }
}
