'use strict';
const url = window.GLOBAL_URL;

const form = document.querySelector('#register');

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
    const data = serializeJson(form);
    //data.creationDate = date;
    //data.email = dataJSON.email;
    //data.password = dataJSON.password;
    const fetchOptions = {
        method: 'POST',
        body: data,
    };



    console.log(data);

    const response = await fetch(url + '/user', fetchOptions);
    const json = await response.json();
    alert(json.message);

    location.href = 'userLogin.html';
})
