'use strict';
const url = window.GLOBAL_URL;

const form = document.querySelector('#register');
const dateInput = document.querySelector('#dateInput');
const usernameInput = document.querySelector('#usernameInput');
const passwordInput = document.querySelector('#passwordInput');
const imageInput = document.querySelector('#image-upload');
const regProfilePic = document.querySelector('#regProfilePic');
const customFileUpload = document.querySelector('.custom-file-upload');

form.action = url + '/user';
form.method = 'post';

const dataReceived = sessionStorage.getItem('user');
const dataJSON = JSON.parse(dataReceived);
console.log('data received: ', dataJSON);

const today = new Date();
const year = today.getFullYear();
const month = ((today.getMonth() + 1) < 10) ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
const day = ((today.getDate()) < 10) ? `0${today.getDate()}` : today.getDate();
const date = `${year}-${month}-${day}`;

dateInput.value = date;
usernameInput.value = dataJSON.email;
passwordInput.value = dataJSON.password;

const displayPicture = (url) => {
    regProfilePic.style.backgroundImage = `url(${url})`
    regProfilePic.style.backgroundSize = 'cover';
    regProfilePic.style.backgroundPosition = 'center center';
    customFileUpload.style.opacity = '0';
    customFileUpload.style.height = '55vw';
    customFileUpload.style.borderRadius = '50%';
    customFileUpload.style.width = '55vw';
}

const modify = (sessionStorage.getItem('modifying-profile')) === 'true';
if (modify) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const inputs = form.querySelectorAll('input');
    const textarea = form.querySelector('#descTextArea')
    // inputs[0].value = user.profilePic;
    inputs[1].value = user.username;
    inputs[2].value = user.title;
    textarea.value = (user.description === null) ? '' : user.description ;
    inputs[3].value = (user.github === null) ? '' : user.github;
    inputs[4].value = (user.tags === null) ? '' : user.tags;
    inputs[5].value = user.creationDate;
    inputs[6].value = user.email;
    inputs[7].value = user.password;
    displayPicture(url + '/uploads/user/' + user.profilePic);
}

form.addEventListener('submit', (evt) => {
    (modify) ? putEventListener(evt) : postEventListener(evt)
})

const putEventListener = async (evt) => {
    evt.preventDefault();
    const data = new FormData(form);
    const fetchOptions = {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: data,
    }
    for (let [key, value] of data.entries()) {
        console.log(key, value);
    }
    try {
        await fetch(url + '/user', fetchOptions);
        location.href = 'userLogin.html';
    } catch (e) {
        console.log(e.message)
    }
    sessionStorage.removeItem('modifying-profile');
}

const postEventListener = async (evt) => {
    evt.preventDefault();
    const data = new FormData(form);
    const fetchOptions = {
        method: 'POST',
        body: data,
    }
    for (let [key, value] of data.entries()) {
        console.log(key, value);
    }
    try {
        await fetch(url + '/user', fetchOptions);
        sessionStorage.removeItem('user');
        location.href = 'userLogin.html';
    } catch (e) {
        console.log(e.message)
    }
}

imageInput.addEventListener('change', () => {
    const image = imageInput.files[0];
    const bgUrl = URL.createObjectURL(image);
    displayPicture(bgUrl);
})


