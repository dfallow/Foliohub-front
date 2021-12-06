'use strict';
const url = window.GLOBAL_URL;

const form = document.querySelector('#register');

form.action = url + '/user';
form.method = 'post';

const dataReceived = sessionStorage.getItem('user');
const dataJSON = JSON.parse(dataReceived);
console.log('data received: ', dataJSON);

const today = new Date();
const year = today.getFullYear();
const month = ((today.getMonth()+1) < 10) ? `0${today.getMonth()+1}` : today.getMonth()+1;
const day = ((today.getDate()) < 10) ? `0${today.getDate()}` : today.getDate();
const date = `${year}-${month}-${day}`;

form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    // const data = serializeJson(form);
    const data = new FormData(form);
    const dataObject = Object.fromEntries(data)
    dataObject.creationDate = date;
    dataObject.email = dataJSON.email;
    dataObject.password = dataJSON.password;
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        // body: JSON.stringify(data),
        body: data,
    }
    for (let [key, value] of data.entries()) {
        console.log(key, value);
    }
    console.log(dataObject);
    await fetch(url + '/user', fetchOptions);


    // location.href = 'userLogin.html';
})
