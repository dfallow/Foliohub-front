'use strict';
const url = window.GLOBAL_URL;

const form = document.querySelector('#register');
const dateInput = document.querySelector('#dateInput');
const usernameInput = document.querySelector('#usernameInput');
const passwordInput = document.querySelector('#passwordInput');
const imageInput = document.querySelector('#image-upload');
const regProfilePic = document.querySelector('#regProfilePic');
const customFileUpload = document.querySelector('.custom-file-upload');
//user tags
const userTagInput = document.querySelector('#input-user-tag');
const userTagInputBtn = document.querySelector('#check-user-tag');
let tagArray = [];

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
// let user = JSON.parse(sessionStorage.getItem('user'));
const modify = (sessionStorage.getItem('modifying-profile')) === 'true';

const getUser = async () => {
    const fetchOptions = {
        method: 'GET',
    }
    try {
        const response = await fetch(url + `/user/${user.userId}`, fetchOptions);
        return await response.json();
    } catch (e) {
        console.log(e.message);
    }
}
const setCurrentUser = async () => {
    const fetchedUser = await getUser();
    sessionStorage.setItem('user', JSON.stringify(fetchedUser));
    // user = JSON.parse(sessionStorage.getItem('user'));
}
if (modify) {
    setCurrentUser().then(() => {
        const inputs = form.querySelectorAll('input');
        const textarea = form.querySelector('#descTextArea')
        // inputs[0].value = ;
        inputs[1].value = user.username;
        inputs[2].value = user.title;
        textarea.value = (user.description === null) ? '' : user.description ;
        //inputs[3].value = (user.tags === null) ? '' : user.tags;
        inputs[4].value = (user.github === null) ? '' : user.github;

        if (user.tags) {
            console.log('should not be here');
            tagArray = user.tags.split(',')
            updateTags(tagArray);
        }


        displayPicture(url + '/uploads/user/' + user.profilePic);
        for (let i of inputs) {
            console.log(i.name, i.value);
        }
        form.method = 'put';
    })

}

form.addEventListener('submit', (evt) => {
    (modify) ? putEventListener(evt) : postEventListener(evt)
})

const putEventListener = async (evt) => {
    evt.preventDefault();
    const data = new FormData(form);
    data.set('tags', tagArray.toString());
    const fetchOptions = {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: data,
    }
    console.log('body values:')
    for (let [key, value] of data.entries()) {
        console.log(key, value);
    }
    try {
        await fetch(url + '/user', fetchOptions);
        await setCurrentUser();
        location.href = 'home.html';
    } catch (e) {
        console.log(e.message)
    }
    sessionStorage.removeItem('modifying-profile');
}

const postEventListener = async (evt) => {
    evt.preventDefault();
    const data = new FormData(form);
    data.set('tags', tagArray.toString());
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

userTagInputBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const charTest = /^[A-Za-z]+$/
    const tag = userTagInput.value
    const valid = charTest.test(tag);

    /* TODO show validation comment for each*/
    if (tagArray.length === 10) {
        console.log('error: ', 'Reached tag limit');
    } else if (tag === "") {
        console.log('error', 'Field is empty');
    } else if (tag.indexOf(' ') !== -1) {
        console.log('error', 'Only one word allowed');
    } else if (!valid) {
        console.log('error', 'No special characters allowed');
    } else {
        console.log('here');
        tagArray.push(tag);
        userTagInput.value = '';
        updateTags(tagArray);
    }
})

function updateTags(tags) {
    const userTagArray = document.querySelector('#user-tags-array');
    userTagArray.innerHTML = '';
    tags.forEach((tag, index) => {
        userTagArray.innerHTML += `<p onclick="removeTag(${index})">${tag}</p>`;
    })
}

function removeTag(index) {
    tagArray.splice(index, 1);
    updateTags(tagArray);
}

window.onbeforeunload = () => {
    if (!sessionStorage.getItem('modifying-profile')) {
        sessionStorage.removeItem('user')
    }
}
