'use strict';

// const drawer = document.querySelector('#side-menu');
const body = document.body;
// const user = JSON.parse(sessionStorage.getItem('user'));


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
    // console.log('user from token', userInfo.user.username);
    return userInfo.user;
}

const getUserGlobal = async () => {
    if (sessionStorage.getItem('token')){
        userGlobal = await checkToken();
        console.log(userGlobal.username);
    }
}

//Logo to home
const logo = document.querySelector('#logo');
if (logo) {
    logo.addEventListener('click', (evt) => {
        location.href = 'home.html';
    })
}

getUserGlobal().then(() => {
    const profilePic = document.querySelector('#profilePic');
    const profilePicContainer = document.querySelector('#profilePicContainer');
    if (userGlobal) {
        //profile pic

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

