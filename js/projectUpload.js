'use strict';
const url = window.GLOBAL_URL;

const form = document.querySelector('#uploadDetails')
const checkbox = document.querySelector('#private');
const drawer = document.querySelector('#side-menu');
const picturesUpload = document.querySelector('#pictures-upload');
const uploadedPics = document.querySelector('#uploadedPictures');
const imageUpload = document.querySelector('#image-upload');

const today = new Date();
const year = today.getFullYear();
const month = ((today.getMonth()+1) < 10) ? `0${today.getMonth()+1}` : today.getMonth()+1;
const day = ((today.getDate()) < 10) ? `0${today.getDate()}` : today.getDate();
const date = `${year}-${month}-${day}`;

const picturesArray = [];

form.addEventListener('submit',  async (evt) => {
    evt.preventDefault();
    const data = new FormData(form);
    data.delete('pictures');
    data.append('date', date);
    data.append('private', (checkbox.checked) ? '1' : '0');
    data.append('pictures', picturesArray.toString());

    const fetchOptions = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: data,
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


picturesUpload.addEventListener('change', () => {
    console.log('test');
    const images = picturesUpload.files;
    console.log(images);
    const arraySelected = Array.from(images);
    if (picturesArray.length + arraySelected.length > 6) {
        alert('Please add 6 images in total');
    } else {
        arraySelected.forEach((item) => {
            picturesArray.push(item)
        });
        console.log(picturesArray);
        picturesArray.forEach(file => console.log('files', file.name));
        updatePictures();

    }
})

function updatePictures() {
    uploadedPics.innerHTML = '';
    picturesArray.forEach((pic, index) => {
        console.log(pic);
        const url = URL.createObjectURL(pic);
        // uploadedPics.innerHTML += `<div id="uploaded-container"><img class="uploaded-pic" src="${url}"><div id="delete-image">X</div></div>`;
        uploadedPics.innerHTML += `<img class="uploaded-pic" src="${url}" onclick="remove(${index})">`;
    })
}

function remove(index) {
    picturesArray.splice(index, 1);
    updatePictures();
}


imageUpload.addEventListener('change', (evt) => {
    console.log('test');
})