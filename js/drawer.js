'use strict';

const sideMenu = document.querySelector('#side-menu');
//Drawer
const drawerUserInfo = document.querySelector('#drawer-user-info');
const drawerPic = document.querySelector('#drawer-pic');
const drawerUsername = document.querySelector('#drawer-user-info h1');
const linkToMyProfile = document.querySelector('#link-to-myprofile');

// linkToMyProfile.href = '../html/myProfile.html?id=$' + user.userId;

// if (drawerUserInfo) {
//     drawerPic.src = (user.profilePic) ? window.GLOBAL_URL + '/uploads/user/' + user.profilePic : '../images/login.png';
//     drawerPic.style.objectFit = 'cover'
//     drawerUsername.innerHTML = user.username;
// }
// if (drawerUserInfo) {
//     drawerUserInfo.addEventListener('click', (evt) => {
//         evt.preventDefault();
//         location.href = (sessionStorage.getItem('user')) ? 'myProfile.html' : 'userLogin.html';
//     });
//
// }


// //settings button in drawer
// const settingsBtn = document.querySelector('.drawer-settings');
// if (settingsBtn) {
//     settingsBtn.href = 'accountCreateExtra.html'
//     settingsBtn.addEventListener('click', () => {
//         if (JSON.parse(sessionStorage.getItem('user'))) {
//             sessionStorage.setItem('modifying-profile', 'true')
//         }
//     });
// }

// //logout button in drawer
// const logoutBtn = document.querySelector('.drawer-logout');
// if (logoutBtn) {
//     logoutBtn.href = "#";
//     logoutBtn.addEventListener('click', async () => {
//         try {
//             const response = await fetch(url + '/auth/logout');
//             const json = await response.json();
//             console.log(json);
//             //remove token
//             sessionStorage.removeItem('token');
//             sessionStorage.removeItem('user');
//             sessionStorage.removeItem('modifying-profile');
//             alert('You have now been logged out');
//             location.href = 'userLogin.html';
//         } catch (e) {
//             console.log(e.message);
//         }
//     });
// }

const createDrawer = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const profilePicSrc = (user.profilePic) ? window.GLOBAL_URL + '/uploads/user/' + user.profilePic : '../images/login.png';

    sideMenu.innerHTML = `<a href="#" id="btn-close" onclick="closeDrawer()">&times;</a>
    <div id="drawer-user-info" onclick="goToMyProfile(user)">
        <img id="drawer-pic" src="${profilePicSrc}" alt="drawer-pic" style="object-fit: cover;">
        <h1>${user.username}</h1>
    </div>

    <a href="home.html">
        <div class="drawer-item">
            <img class="drawer-item-logo" src="../images/home.png" alt="">
            <p>Home</p>
        </div>
    </a>
    
    <a id="link-to-myprofile" href="../html/myProfile.html?id=${user.userId}">
        <div class="drawer-item">
            <img class="drawer-item-logo" src="../images/portfolio.png" alt="">
            <p>My projects</p>
        </div>
    </a>
    
    <a href="projectUpload.html">
        <div class="drawer-item">
            <img class="drawer-item-logo" src="../images/upload.png" alt="">
            <p>Upload project</p>
        </div>
    </a>
    
    <a href="#">
        <div class="drawer-item">
            <img class="drawer-item-logo" src="../images/share.png" alt="">
            <p>Share project</p>
        </div>
    </a>
    
    <a class="drawer-settings" href="../html/accountCreateExtra.html" onclick="modifyAccount()">
        <div class="drawer-item">
            <img class="drawer-item-logo" src="../images/settings.png" alt="">
            <p>Account settings</p>
        </div>
    </a>
    
    <a class="drawer-logout" href="#" onclick="logout()">
        <div class="drawer-item">
            <img class="drawer-item-logo" src="../images/logout.png" alt="">
            <p>Logout</p>
        </div>
    </a>`
}

function openDrawer() {
    sideMenu.style.display = 'flex';
    sideMenu.style.width = '70vw';
    body.style.overflow = 'hidden';
}

function closeDrawer() {
    sideMenu.style.display = 'none';
    sideMenu.style.width = '0';
    body.style.overflow = 'auto';
}

function modifyAccount() {
    sessionStorage.setItem('modifying-profile', 'true');
}

function goToMyProfile(user) {
    location.href = `../html/myProfile.html?id=${user.userId}`;
}

async function logout() {
    try {
        const response = await fetch(window.GLOBAL_URL + '/auth/logout');
        const json = await response.json();
        console.log(json);
        //empty sessionStorage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('modifying-profile');
        alert('You have now been logged out');
        location.href = '../html/home.html';
    } catch (e) {
        console.log(e.message);
    }
}

if (sessionStorage.getItem('user')) {
    createDrawer()
}