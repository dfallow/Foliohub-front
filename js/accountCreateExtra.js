/*
* Name: accountCreateExtra.js
* Description: Script handling the validation of tags and the retrieval of form data for creating
* and updating user accounts.
*/

'use strict';
const url = window.GLOBAL_URL;

const form = document.querySelector('#register');
// hidden inputs that hold the values passed on from accountCreate
const usernameInput = document.querySelector('#usernameInput');
const passwordInput = document.querySelector('#passwordInput');
// other inputs
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

// if creating a new account (not updating), retrieving the data sent forward from createAccount.js
if (!sessionStorage.getItem('modifying-profile')) {
    const dataReceived = sessionStorage.getItem('dataSentToExtra');
    const dataJSON = JSON.parse(dataReceived);
    usernameInput.value = dataJSON.email;
    passwordInput.value = dataJSON.password;
}

// handling the update of an account's info: displaying previously uploaded profile pic
const displayPicture = (url) => {
    regProfilePic.style.backgroundImage = `url(${url})`
    regProfilePic.style.backgroundSize = 'cover';
    regProfilePic.style.backgroundPosition = 'center center';
    customFileUpload.style.opacity = '0';
    customFileUpload.style.height = '55vw';
    customFileUpload.style.borderRadius = '50%';
    customFileUpload.style.width = '55vw';
}

// handling the update of an account's info: checking whether to insert new user or update
const modify = (sessionStorage.getItem('modifying-profile')) === 'true';

// handling the update of an account's info: selecting form submit listener for either POST or PUT
form.addEventListener('submit', (evt) => {
    (modify) ? putEventListener(evt) : postEventListener(evt)
})

// handling the update of an account's info: filling up all the inputs with previous entries
if (modify) {
    getUserGlobal().then(() => {
        const user = userGlobal;
        const inputs = form.querySelectorAll('input');
        const textarea = form.querySelector('#descTextArea')
        inputs[1].value = user.username;
        inputs[2].value = user.title;
        textarea.value = (user.description === null) ? '' : user.description ;
        inputs[4].value = (user.github === null) ? '' : user.github;

        if (user.tags) {
            tagArray = user.tags.split(',');
            updateTags(tagArray);
        }

        displayPicture(url + '/uploads/user/' + user.profilePic);
        form.method = 'put';
    })
}

// handling the update of an account's info: updating the token in sessionStorage after putting user
const refreshToken = async () => {
    const fetchOptions1 = {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        }
    }

    // getting user credentials again
    const response1 = await fetch(url + '/user/refreshToken/', fetchOptions1);
    const loginInfo = await response1.json();

    // logging in again to get another token and update req.user
    const jsonString = `{"username":"${loginInfo.email}","password":"${loginInfo.password}"}`
    const fetchOptions2 = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonString,
    };
    const response = await fetch(url + '/auth/login', fetchOptions2);
    const json = await response.json();
    // save token
    sessionStorage.setItem('token', json.token);
}

// handling the update of an account's info: submit listener for updating user
const putEventListener = async (evt) => {
    evt.preventDefault();
    const data = new FormData(form);
    // adding tags to the formData
    data.set('tags', tagArray.toString());
    const fetchOptions = {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: data,
    }
    try {
        await fetch(url + '/user', fetchOptions);
        await refreshToken()
        location.href = 'home.html';
    } catch (e) {
        console.log(e.message)
    }
    // removing the sessionStorage item that indicates that the account needs to be updated and not inserted
    sessionStorage.removeItem('modifying-profile');
}

// handling the update of an account's info: submit listener for inserting user
const postEventListener = async (evt) => {
    evt.preventDefault();
    const data = new FormData(form);
    data.set('tags', tagArray.toString());
    const fetchOptions = {
        method: 'POST',
        body: data,
    }
    try {
        await fetch(url + '/user', fetchOptions);
        // removing data passed on from accountCreate
        sessionStorage.removeItem('dataSentToExtra');
        location.href = 'userLogin.html';
    } catch (e) {
        console.log(e.message)
    }
}

// when selecting a profile pic, displaying it
imageInput.addEventListener('change', () => {
    const image = imageInput.files[0];
    const bgUrl = URL.createObjectURL(image);
    displayPicture(bgUrl);
})

// handling tag input validation and inserting tags into an array that will be added to the formData on submit
userTagInputBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const tag = userTagInput.value
    let errorMessage;

    // validation
    if (tagArray.length === 10) {
        errorMessage = 'Reached Tag Limit'
    } else if (tag === "") {
        errorMessage = 'Tag Field is empty';
    } else if (tag.length > 15) {
        errorMessage = 'Tag is too long';
    } else {
        // adding tag to array with uppercase on first letter and displaying the added tags
        tagArray.push(tag.toUpperCase().charAt(0) + tag.slice(1));
        userTagInput.value = '';
        updateTags(tagArray);
    }
    // showing error message
    if(errorMessage) {
        userTagError.innerHTML = errorMessage;
        if (errorMessage.length > 0) {
            userTagError.innerHTML = errorMessage;
            userTagError.style.display = 'block';
            setTimeout(function () {
                userTagError.innerHTML = ''
                userTagError.style.display = 'none'
            }, 5000);
        }
    }
})

// displaying added tags and setting onclick listener to delete them
function updateTags(tags) {
    const userTagArray = document.querySelector('#user-tags-array');
    userTagArray.innerHTML = '';
    tags.forEach((tag, index) => {
        userTagArray.innerHTML += `<p onclick="removeTag(${index})">${tag}</p>`;
    })
}

// removing a tag and updating display
function removeTag(index) {
    tagArray.splice(index, 1);
    updateTags(tagArray);
}

// modifying UI if user is updating their profile. no delete button on profile creation
if(!sessionStorage.getItem('modifying-profile')) {
    deleteBtn.style.display = 'none';
    buttonsDiv.style.justifyContent = 'center';
}

// delete own profile (or any profile if logged in as admin) after double confirmation
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
                    await fetch(url + '/user', fetchOptions);
                    // emptying session storage to log out
                    sessionStorage.clear()
                    window.location.replace(`../html/home.html`);
                }
            }}
    })
}
