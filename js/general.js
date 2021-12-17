/*
* Name: general.js
* Description: Script handling a bunch of functionalities that are commonly needed on several pages
*/

'use strict';
const body = document.body;

// setting userGlobal, a variable containing info about the current user
// from req.user which is retrieved via the JWT token.
// the variable is then used in most other js files
let userGlobal;
const checkToken = async () => {
    const fetchOptions = {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        }
    }
    const response = await fetch(window.GLOBAL_URL + '/user/token/', fetchOptions);
    const userInfo = await response.json();
    return userInfo.user;
}

const getUserGlobal = async () => {
    if (sessionStorage.getItem('token')){
        userGlobal = await checkToken();
    }
}

// wherever there is a logo, clicking it will bring the user to the home page
const logo = document.querySelector('#logo');
if (logo) {
    logo.addEventListener('click', (evt) => {
        location.href = 'home.html';
    })
}

// if a user is logged in, their profile picture is displayed in the top right corner of their screen.
// in that case, clicking it will bring the user to myProfile.
// otherwise, the top right button is used to redirect the user to the userLogin page.
getUserGlobal().then(() => {
    const profilePic = document.querySelector('#profilePic');
    const profilePicContainer = document.querySelector('#profilePicContainer');
    if (userGlobal) {
        if(profilePic){
            profilePic.src = (userGlobal.profilePic) ? window.GLOBAL_URL + '/uploads/user/' + userGlobal.profilePic : '../images/login.png';
            profilePic.style.width = '100%';
            profilePic.style.height = '100%';
            profilePic.style.opacity = '100%';
            profilePic.style.borderRadius = '50%';
            profilePic.style.objectFit = 'cover';
            profilePicContainer.style.border = 'none';
            profilePicContainer.style.padding = '0';
        }
    }
    if (profilePic) {
        profilePic.addEventListener('click', (evt) => {
            evt.preventDefault();
            location.href = (userGlobal) ? 'myProfile.html?id=' + userGlobal.userId : 'userLogin.html';
        });
    }

    // if no one is logged in, the menu button can be used to reach the about page
    const menuBtn = document.querySelector('#menuBtn');
    if (menuBtn) {
        if (!userGlobal) {
            menuBtn.removeAttribute('onclick')
            menuBtn.innerHTML = `<a style="width: 98px; height: 98px;" href="../html/about.html">
                                    <img style="border-radius: 50%; width: 98px; height: 98px; filter: invert(100%);" src="../images/info.png"</a>`
            menuBtn.style.border = 'none';
        }
    }
})

