'use strict';
const url = window.GLOBAL_URL;

const registerForm = document.querySelector('#register');
const timestampInput = document.querySelector('#timestampHidden');

registerForm.action = `${url}/user`
registerForm.method = 'post'

registerForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const today = new Date();
    const year = today.getFullYear();
    const month = ((today.getMonth()+1) < 10) ? `0${today.getMonth()+1}` : today.getMonth()+1;
    const day = ((today.getDate()) < 10) ? `0${today.getDate()}` : today.getDate();
    timestampInput.value = `${year}-${month}-${day}`;
    const data = serializeJson(registerForm);
    console.log(data);
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:
            JSON.stringify(data),
    };

    console.log('user creation response', fetchOptions.body);
    const response = await fetch(url + '/user', fetchOptions);
    const json = await response.json();
    if(!json.user) {
        alert(json.message);
    } else {
        sessionStorage.setItem('user', JSON.stringify(json.user));
        location.href = 'accountCreateExtra.html';
    }

})