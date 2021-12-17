/*
* Name: accountCreate.js
* Description: Script handling validation for new email/password
* and sending username and password forward to accountCreateExtra.
*/

'use strict';
const url = window.GLOBAL_URL;

const registerForm = document.querySelector('#register');
const inputs = registerForm.querySelectorAll('input');
// handling error messages for validation
const errorEmail = document.querySelector('#errorEmail');
const errorPass = document.querySelector('#errorPass');
// regex for password validation pattern
const regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");

registerForm.action = `${url}/user`
registerForm.method = 'post'

// listeners for handling form validation: email confirmation
inputs[1].addEventListener('input', () => {
    const emailsMatch = inputs[0].value === inputs[1].value;
    if (inputs[1].value.length > 0) {
        if (!emailsMatch) {
            errorEmail.style.display = 'block';
            errorEmail.innerHTML = '⚠️Emails must match 🕵️'
        } else {
            errorEmail.style.display = 'none';
        }
    }
})

//  listeners for handling form validation: password validation pattern
inputs[2].addEventListener('input', () => {
    const regexChecked = regex.test(inputs[2].value);
    if (inputs[2].value.length >= 3 && !regexChecked) {
        errorPass.style.display = 'block';
        errorPass.innerHTML = 'Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number 🕵️'
    } else {
        errorPass.style.display = 'none';
    }
})

// listeners for handling form validation: password validation pattern and confirmation
inputs[3].addEventListener('input', () => {
    const passMatch = inputs[2].value === inputs[3].value;
    const regexChecked = regex.test(inputs[2].value);
    if (inputs[2].value.length >= 3 && !regexChecked) {
        errorPass.style.display = 'block';
        errorPass.innerHTML = 'Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number 🕵️'
    } else {
        if (inputs[3].value.length > 0 && !passMatch) {
            errorPass.style.display = 'block';
            errorPass.innerHTML = '⚠️Passwords must match 🕵️'
        } else {
            errorPass.style.display = 'none';
        }
    }
})

// checking if email entered is already in use: getting the list of all existing users
const getUsers = async () => {
    const fetchOptions = {
        method: 'GET',
    }
    try {
        const response = await fetch(url + `/user`, fetchOptions);
        return await response.json();
    } catch (e) {
        console.log(e.message);
    }
}

// checking if email entered is already in use: comparing current entry to existing ones
const CheckCurrentEmails = async (writtenEmail) => {
    const fetchedUsers = await getUsers()
    const users = JSON.parse(JSON.stringify(fetchedUsers));
    for (let user of users) {
        const email = user.email
        if (inputs[0].value.length > 0 && email === writtenEmail) {
            errorEmail.style.display = 'block';
            errorEmail.innerHTML = '⚠️Email is already in use.'
            break
        }
    }
}

//used in html onfocusout
function checkEmail() {
    const writtenEmail = inputs[0].value
    CheckCurrentEmails(writtenEmail);
}

//used in html onfocusin to remove the error message
function removeError () {
    inputs[0].value = ''
    errorEmail.style.display = 'none';
}

//checking that everything is valid before passing on data to next page accountCreateExtra
registerForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const emailsMatch = inputs[0].value === inputs[1].value;
    const passMatch = inputs[2].value === inputs[3].value;
    const regexChecked = regex.test(inputs[2].value);
    if (emailsMatch && passMatch && regexChecked) {
        const data = serializeJson(registerForm);
        sessionStorage.setItem('dataSentToExtra', JSON.stringify(data));
        location.href = 'accountCreateExtra.html';
    }
})

