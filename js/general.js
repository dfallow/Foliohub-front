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
        profilePic.src = (user.profilePic) ? window.GLOBAL_URL + '/thumbnails/user/' + user.profilePic : '../images/login.png';
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

//Github / GitLab / other
const githubLink = document.querySelector('#github');

if (githubLink) {
    if (!user.github) {
        githubLink.style.visibility = 'hidden';
    } else {
        githubLink.style.backgroundSize = 'cover';
        if (!user.github.includes('http')) {
            githubLink.href = 'http://' + user.github;
        } else {
            githubLink.href = user.github;
        }
        if (user.github.includes('github')) {
            githubLink.style.backgroundImage = "url('../images/github.png')"
        } else if (user.github.includes('gitlab')) {
            githubLink.style.backgroundImage = "url('../images/gitlab.png')"
            githubLink.style.backgroundColor = "white"
        } else {
            githubLink.style.backgroundImage = "url('../images/idk.png')"
        }
    }
}
