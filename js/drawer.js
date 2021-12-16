'use strict';

const sideMenu = document.querySelector('#side-menu');
//Drawer

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

const getUser = () => {

}

function openDrawer() {
    console.log('trying to open')
    sideMenu.style.display = 'flex';
    sideMenu.animate([
        {width: '0'},
        {width: '500px'}
    ], {
        duration: 100,
        fill: "forwards"
    });



    // sideMenu.style.display = 'flex';
    // sideMenu.style.minWidth = '500px';
    body.style.overflow = 'hidden';
}

function closeDrawer() {
    sideMenu.animate([
        {width: '500px'},
        {width: '0'}
    ], {
        duration: 100,
        fill:"forwards"
    })
    body.style.overflow = 'auto';
    // sideMenu.style.width = '0';
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
        sessionStorage.clear();
        alert('You have now been logged out');
        location.href = '../html/home.html';
    } catch (e) {
        console.log(e.message);
    }
}

if (sessionStorage.getItem('user')) {
    createDrawer()
}