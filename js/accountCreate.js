'use strict';
const url = window.GLOBAL_URL;

const registerForm = document.querySelector('#register');
const inputs = registerForm.querySelectorAll('input');
const errorEmail = document.querySelector('#errorEmail');
const errorPass = document.querySelector('#errorPass');
const regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");


registerForm.action = `${url}/user`
registerForm.method = 'post'

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

inputs[2].addEventListener('input', () => {
    const regexChecked = regex.test(inputs[2].value);
    if (inputs[2].value.length >= 3 && !regexChecked) {
        errorPass.style.display = 'block';
        errorPass.innerHTML = 'Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number 🕵️'
    } else {
        errorPass.style.display = 'none';
    }
})

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

const getUser = async () => {
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

const CheckCurrentEmails = async (writtenEmail) => {
    const fetchedUser = await getUser()
    const users = JSON.parse(JSON.stringify(fetchedUser));
    for (let user of users) {
        const email = user.email
        if (inputs[0].value.length > 0 && email === writtenEmail) {
            errorEmail.style.display = 'block';
            errorEmail.innerHTML = '⚠️Email is already in use.'
            break
        }
    }
}

function checkEmail() {
    const writtenEmail = inputs[0].value
    CheckCurrentEmails(writtenEmail);
}

function removeError () {
    inputs[0].value = ''
    errorEmail.style.display = 'none';
}
registerForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const emailsMatch = inputs[0].value === inputs[1].value;
    const passMatch = inputs[2].value === inputs[3].value;
    const regexChecked = regex.test(inputs[2].value);

    if (emailsMatch && passMatch && regexChecked) {
        const data = serializeJson(registerForm);
        console.log(data);
        sessionStorage.setItem('user', JSON.stringify(data));

        console.log('data sent: ', JSON.stringify(data));
        location.href = 'accountCreateExtra.html';
    }

})

