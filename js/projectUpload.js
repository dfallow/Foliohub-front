'use strict';
const url = window.GLOBAL_URL;

const form = document.querySelector('#uploadDetails')
const checkbox = document.querySelector('#private');
const drawer = document.querySelector('#side-menu');

const today = new Date();
const year = today.getFullYear();
const month = ((today.getMonth()+1) < 10) ? `0${today.getMonth()+1}` : today.getMonth()+1;
const day = ((today.getDate()) < 10) ? `0${today.getDate()}` : today.getDate();
const date = `${year}-${month}-${day}`;

form.addEventListener('submit',  async (evt) => {
    evt.preventDefault();
    // const data = new FormData(form);
    const jsonData = serializeJson(form);
    jsonData.date = date;
    jsonData.private = (checkbox.checked) ? '1' : '0';
    const fetchOptions = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            'Content-type': 'application/json'
        },
        body: JSON.stringify(jsonData),
    }

    // for (let [key, value] of data.entries()) {
    //     console.log(key, value);
    // }

    console.log(JSON.stringify(jsonData))

    const response = await fetch(url + '/project/personal', fetchOptions);
    const json = await response.json();
    console.log(json);
    // location.href = 'myProfile.html';
})

function openDrawer() {
    drawer.style.visibility = 'visible';
    drawer.style.width = '70vw';
}

function closeDrawer() {
    drawer.style.visibility = 'hidden';
    drawer.style.width = '0';
}