'use strict';
const url = window.GLOBAL_URL;

const form = document.querySelector('#register');
const dateInput = document.querySelector('#dateInput');
const usernameInput = document.querySelector('#usernameInput');
const passwordInput = document.querySelector('#passwordInput');
const imageInput = document.querySelector('#image-upload');
const regProfilePic = document.querySelector('#regProfilePic');
const customFileUpload = document.querySelector('.custom-file-upload');
const deleteBtn = document.querySelector('#delete-account-btn');
const buttonsDiv = document.querySelector('#buttons');
//user tags
const userTagInput = document.querySelector('#input-user-tag');
const userTagInputBtn = document.querySelector('#check-user-tag');
const userTagError = document.querySelector('#tag-error');
let tagArray = [];

form.action = url + '/user';
form.method = 'post';

const dataReceived = sessionStorage.getItem('dataSentToExtra');
const dataJSON = JSON.parse(dataReceived);
console.log('data received: ', dataJSON);

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
        const response = await fetch(url + '/user', fetchOptions);
        const json = await response.json();
        console.log(json);
        sessionStorage.removeItem('dataSentToExtra');
        console.log('removed user');
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
    let errorMessage;

    if (tagArray.length === 10) {
        errorMessage = 'Reached Tag Limit'
    } else if (tag === "") {
        errorMessage = 'Tag Field is empty';
    } else if (tag.length > 15) {
        errorMessage = 'Tag is too long';
    } else {
        tagArray.push(tag);
        userTagInput.value = '';
        updateTags(tagArray);
    }
    console.log('here');
    console.log(errorMessage);
    if(errorMessage) {
        userTagError.innerHTML = errorMessage;
        if (errorMessage.length > 0) {
            console.log('after');
            userTagError.innerHTML = errorMessage;
            userTagError.style.display = 'block';
            setTimeout(function () {
                userTagError.innerHTML = ''
                userTagError.style.display = 'none'
            }, 5000);
        }
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

if(!sessionStorage.getItem('modifying-profile')) {
    deleteBtn.style.display = 'none';
    buttonsDiv.style.justifyContent = 'center';
}

if(deleteBtn) {
    deleteBtn.addEventListener('click', async (evt) => {
        evt.preventDefault();
        if (sessionStorage.getItem('modifying-profile')) {
            if (window.confirm('Do you really want to delete your account? ☹')) {
                if (window.confirm("There's no coming back!")) {
                    const fetchOptions = {
                        method: 'DELETE',
                        headers: {
                            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                        }
                    }
                    const response = await fetch(url + '/user', fetchOptions);
                    console.log(response.json());
                    sessionStorage.clear()
                    window.location.replace(`../html/home.html`);
                }
            }}
    })
}
