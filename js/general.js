'use strict';

const drawer = document.querySelector('#side-menu');
const body = document.body;
const user = JSON.parse(sessionStorage.getItem('user'));

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
    });
}

//logout button in drawer
const logoutBtn = document.querySelector('.drawer-logout');
if (logoutBtn) {
    logoutBtn.href = "#";
    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(url + '/auth/logout');
            const json = await response.json();
            console.log(json);
            //remove token
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('modifying-profile');
            alert('You have now been logged out');
            location.href = 'userLogin.html';
        } catch (e) {
            console.log(e.message);
        }
    });
}

const drawerUserInfo = document.querySelector('#drawer-user-info');
const drawerPic = document.querySelector('#drawer-pic');
const drawerUsername = document.querySelector('#drawer-user-info h1');

if (drawerUserInfo) {
    drawerPic.src = (user.profilePic) ? window.GLOBAL_URL + '/uploads/user/' + user.profilePic : '../images/login.png';
    drawerPic.style.objectFit = 'cover'
    drawerUsername.innerHTML = user.username;
}
if (drawerUserInfo) {
    drawerUserInfo.addEventListener('click', (evt) => {
        evt.preventDefault();
        location.href = (sessionStorage.getItem('user')) ? 'myProfile.html' : 'userLogin.html';
    });
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
        profilePic.style.borderRadius = '200px';
        profilePic.style.objectFit = 'cover';
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
        } else {
            githubLink.style.backgroundImage = "url('../images/idk.png')"
        }
    }
}
