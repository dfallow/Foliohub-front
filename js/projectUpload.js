'use strict';
const url = window.GLOBAL_URL;

const form = document.querySelector('#uploadDetails')
const checkbox = document.querySelector('#private');
const drawer = document.querySelector('#side-menu');
//images
const picturesUpload = document.querySelector('#pictures-upload');
const uploadedPics = document.querySelector('#uploadedPictures');
const imageUpload = document.querySelector('#image-upload');
const regProjectsPic = document.querySelector('#regProjectPic');
const customFileUpload = document.querySelector('.custom-file-upload');
//video
const addVideoBtn = document.querySelector('#add-youtube-video');
const removeVideoBtn = document.querySelector('#remove-youtube-video');
const videoWrapper = document.querySelector('.video-wrapper');
const videoUpload = document.querySelector('#video-upload');
const iframe = document.querySelector('iframe');

form.action = url + '/project';
form.method = 'post';

const today = new Date();
const year = today.getFullYear();
const month = ((today.getMonth()+1) < 10) ? `0${today.getMonth()+1}` : today.getMonth()+1;
const day = ((today.getDate()) < 10) ? `0${today.getDate()}` : today.getDate();
const date = `${year}-${month}-${day}`;

const picturesArray = [];

const modifyingProject = sessionStorage.getItem('modifying-project') === 'true';

if (modifyingProject) {
    
}

form.addEventListener('submit',  async (evt) => {
    evt.preventDefault();
    let imageFiles = new DataTransfer();
    picturesArray.forEach((file) => {
        imageFiles.items.add(file)
    })
    picturesUpload.files = imageFiles.files;
    if (videoUpload.value) {
        const urlSplit = (videoUpload.value).split('=');
        videoUpload.value = urlSplit[urlSplit.length - 1];
    }
    const data = new FormData(form);
    data.append('date', date);
    data.append('private', (checkbox.checked) ? '1' : '0');

    const fetchOptions = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: data,
    }

    for (let [key, value] of data.entries()) {
        console.log(key, value);
    }

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

addVideoBtn.addEventListener('click', () => {
    const urlSplit = (videoUpload.value).split('=');
    const urlEnding = urlSplit[urlSplit.length - 1];
    console.log('url ending: ',urlEnding);
    addVideoBtn.style.display = 'none';
    videoUpload.style.display = 'none';
    videoWrapper.innerHTML = `<iframe width="100%" height="100%"  src="https://www.youtube.com/embed/${urlEnding}" title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    removeVideoBtn.style.display = 'block';
    videoWrapper.style.display = 'block';
})

removeVideoBtn.addEventListener('click', () => {
    removeVideoBtn.style.display = 'none';
    videoWrapper.style.display = 'none';
    addVideoBtn.style.display = 'block';
    videoUpload.style.display = 'block';
    videoUpload.value = '';
})


picturesUpload.addEventListener('change', () => {
    const images = picturesUpload.files;
    const arraySelected = Array.from(images);
    if (picturesArray.length + arraySelected.length > 6) {
        alert('Please add 6 images in total');
    } else {
        arraySelected.forEach((item) => {
            picturesArray.push(item)
        });
        updatePictures();
    }
})

function updatePictures() {
    uploadedPics.innerHTML = '';
    picturesArray.forEach((pic, index) => {
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
    const image = imageUpload.files[0];
    const url = URL.createObjectURL(image);
    displayProjectLogo(url);
})

function displayProjectLogo(url) {
    regProjectsPic.style.backgroundImage = `url(${url})`
    regProjectsPic.style.backgroundSize = 'cover';
    regProjectsPic.style.backgroundPosition = 'center center';
    customFileUpload.style.opacity = '0';
    customFileUpload.style.height = '35vw';
    customFileUpload.style.borderRadius = '50%';
    customFileUpload.style.width = '35vw';
}