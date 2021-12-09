'use strict';
const url = window.GLOBAL_URL;

const registerForm = document.querySelector('#register');
const inputs = registerForm.querySelectorAll('input');
const errorEmail = document.querySelector('#errorEmail');
const errorPass = document.querySelector('#errorPass');

registerForm.action = `${url}/user`
registerForm.method = 'post'

// let emailList = []

// function setEmailList() =

inputs[1].addEventListener('input', () => {
    if (inputs[1].value.length > 0) {
        if (inputs[0].value !== inputs[1].value) {
            errorEmail.style.display = 'block';
            errorEmail.innerHTML = '⚠️Emails must match 🕵️'
        } else {
            errorEmail.style.display = 'none';
        }
    }
} )

inputs[3].addEventListener('input', () => {
    if (inputs[3].value.length > 0) {
        if (inputs[2].value !== inputs[3].value) {
            errorPass.style.display = 'block';
            errorPass.innerHTML = '⚠️Passwords must match 🕵️'
        } else {
            errorPass.style.display = 'none';
        }
    }
} )

registerForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const emailsMatch = inputs[0].value === inputs[1].value;
    const passMatch = inputs[2].value === inputs[3].value;

    if (emailsMatch && passMatch) {
        const data = serializeJson(registerForm);
        console.log(data);
        sessionStorage.setItem('user', JSON.stringify(data));

        console.log('data sent: ', JSON.stringify(data));
        location.href = 'accountCreateExtra.html';
    }

})

const getAllEmails = async () => {

    const response = await
}