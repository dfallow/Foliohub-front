    'use strict';
const url = window.GLOBAL_URL;

// select existing html elements
const loginForm = document.querySelector('#login');

loginForm.action = `${url}/auth/login`;

// login
loginForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = serializeJson(loginForm);
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(url + '/auth/login', fetchOptions);
    const json = await response.json();
    console.log('login response', json);
    if (!json.user) {
        alert(json.message);
    } else {
        // save token
        sessionStorage.setItem('token', json.token);
        sessionStorage.setItem('user', JSON.stringify(json.user));
        console.log('location href', location.href)
        location.href = 'home.html';
    }
});