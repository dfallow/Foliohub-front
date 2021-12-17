/*
* Name: drawer.js
* Description: Script handling the display and functionalities of the side-menu/drawer
*/

'use strict';

//Drawer
const sideMenu = document.querySelector('#side-menu');

// creating drawer with links to home, myProfile, projectUpload, accountCreateExtra(for updating profile) and logout
const createDrawer = (userGlobal) => {
    const profilePicSrc = (userGlobal.profilePic) ? window.GLOBAL_URL + '/uploads/user/' + userGlobal.profilePic : '../images/login.png';
    sideMenu.innerHTML = `<a href="#" id="btn-close" onclick="closeDrawer()">&times;</a>
    <div id="drawer-user-info" onclick="goToMyProfile(userGlobal)">
        <img id="drawer-pic" src="${profilePicSrc}" alt="drawer-pic" style="object-fit: cover;">
        <h1>${userGlobal.username}</h1>
    </div>

    <a href="home.html">
        <div class="drawer-item">
            <img class="drawer-item-logo" src="../images/home.png" alt="">
            <p>Home</p>
        </div>
    </a>
    
    <a id="link-to-myprofile" href="../html/myProfile.html?id=${userGlobal.userId}">
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

// opening drawer with different animations and styles depending on the aspect-ratio of the current screen
const aspectRatio = screen.width / screen.height
function openDrawer() {
    sideMenu.style.display = 'flex';
    if(aspectRatio > 1) {
        sideMenu.animate([
            {width: '0'},
            {width: '500px'}
        ], {
            duration: 100,
            fill: "forwards"
        });
    } else sideMenu.style.width = '85%'
    body.style.overflow = 'hidden';
}

// closing drawer
function closeDrawer() {
    if (aspectRatio > 1) {
        sideMenu.animate([
            {width: '500px'},
            {width: '0'}
        ], {
            duration: 100,
            fill: "forwards"
        })
    } else {
        sideMenu.style.display = 'none';
    }
    body.style.overflow = 'auto';
}

// functions for navigation (item menu onclicks)
function modifyAccount() {
    sessionStorage.setItem('modifying-profile', 'true');
}
function goToMyProfile(user) {
    location.href = `../html/myProfile.html?id=${user.userId}`;
}

async function logout() {
    try {
        await fetch(window.GLOBAL_URL + '/auth/logout');
        //empty sessionStorage
        sessionStorage.clear();
        alert('You have now been logged out');
        location.href = '../html/home.html';
    } catch (e) {
        console.log(e.message);
    }
}

// making sure that userGlobal is set with req.user data before creating the drawer.
// a visitor should not have access to the drawer
getUserGlobal().then(() => {
    if (userGlobal) {
        createDrawer(userGlobal);
    }
});