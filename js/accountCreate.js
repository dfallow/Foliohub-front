'use strict';
const url = window.GLOBAL_URL;

const registerForm = document.querySelector('#register');

registerForm.action = `${url}/user`
registerForm.method = 'post'

registerForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const data = serializeJson(registerForm);
    console.log(data);
    // const fetchOptions = {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body:
    //         JSON.stringify(data),
    // };
    //
    // console.log('user creation response', fetchOptions.body);
    // const response = await fetch(url + '/user', fetchOptions);
    // const json = await response.json();
    sessionStorage.setItem('user', JSON.stringify(data));

    console.log('data sent: ', JSON.stringify(data));
    location.href = 'accountCreateExtra.html';
})