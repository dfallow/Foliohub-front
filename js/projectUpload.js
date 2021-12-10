'use strict';
const url = window.GLOBAL_URL;

const form = document.querySelector('#uploadDetails')
const checkbox = document.querySelector('#private');
//images
const picturesUpload = document.querySelector('#pictures-upload');
const uploadedPics = document.querySelector('#uploadedPictures');
const imageUpload = document.querySelector('#image-upload');
const regProjectsPic = document.querySelector('#regProjectPic');
const customFileUpload = document.querySelector('.custom-file-upload');
//video
const checkVideoBtn = document.querySelector('#check-youtube-video');
const removeVideoBtn = document.querySelector('#remove-youtube-video');
const videoWrapper = document.querySelector('.video-wrapper');
const videoUpload = document.querySelector('#video-upload');

const submitBtn = document.querySelector('#submit-btn');
const deleteBtn = document.querySelector('#deleteBtn');

form.action = url + '/project';
form.method = 'post';

const today = new Date();
const year = today.getFullYear();
const month = ((today.getMonth()+1) < 10) ? `0${today.getMonth()+1}` : today.getMonth()+1;
const day = ((today.getDate()) < 10) ? `0${today.getDate()}` : today.getDate();
const date = `${year}-${month}-${day}`;

const picturesArray = [];

const getProject = async (projectId) => {
    try {
        const fetchOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        }
        const response = await fetch(url + '/project/personal/' + projectId, fetchOptions);
        const project = await response.json();
        console.log(project);
        return project;
    } catch (e) {
        console.log(e.message);
    }
};

const modifyingProject = sessionStorage.getItem('modifying-project') === 'true';

let currentProject;

const setCurrentProject = async (id) => {
    currentProject = await getProject(id);
}

const urlToObject= async(url, filename)=> {
    const response = await fetch(url);
    // here image is url/location of image
    const blob = await response.blob();
    return new File([blob], `${filename}`, {type: blob.type});
}

let imageFiles = new DataTransfer();
let logoFile = new DataTransfer();

const createDataTransfer = async (strings) => {
    for (const string of strings) {
        imageFiles.items.add(await urlToObject(url + '/uploads/project/' + string, string));
    }
    console.log(imageFiles);
}

const logoToDataTransfer = async (string) => {
    logoFile.items.add(await urlToObject(url + '/uploads/project/' + string, string))
}

if (modifyingProject) {
    let currentUrl = window.location.href;
    const projectId = currentUrl.split('=').pop();
    setCurrentProject(projectId).then(() => {
        if (currentProject.logo) {
            logoToDataTransfer(currentProject.logo).then(() => {
                imageUpload.files = logoFile.files
                displayProjectLogo(url + '/uploads/project/' + currentProject.logo);
                console.log(imageUpload.files);
            });
        }
        const inputs = form.querySelectorAll('input');
        const longTextarea = form.querySelector('#longDescTextArea');
        const shortTextarea = form.querySelector('#shortDescTextArea');
        const uploadedPictures = form.querySelector('#uploadedPictures');

        if (currentProject.images) {
            const storedImageHashcodes = currentProject.images.split(',');
            createDataTransfer(storedImageHashcodes).then(() => {
                uploadedPictures.files = imageFiles.files;
                const images = uploadedPictures.files;
                const arraySelected = Array.from(images);
                arraySelected.forEach((item) => {
                    picturesArray.push(item)
                })
                updatePictures();
            });
        }

        // inputs[0].value = (!currentProject) ? '' : currentProject;
        inputs[1].value = (!currentProject.name) ? '' : currentProject.name;
        shortTextarea.value =  (!currentProject.outline) ? '' : currentProject.outline;
        inputs[2].value = (!currentProject.tags) ? '' : currentProject.tags;
        inputs[3].value = (!currentProject.video) ? '' : currentProject.video;
        longTextarea.value = (!currentProject.description) ? '' : currentProject.description;
        inputs[5].checked = currentProject.private === 1;
    })
    submitBtn.innerHTML = 'Update';
    deleteBtn.style.display = 'block';
    deleteBtn.style.backgroundColor = 'red';
    deleteBtn.style.color = 'white';
}

form.addEventListener('submit', (evt => {
    (modifyingProject) ? putEventListener(evt) : postEventListener(evt)
}))

const putEventListener = async (evt) => {
    sessionStorage.removeItem('modifying-project');
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
    data.append('private', (checkbox.checked) ? '1' : '0');

    const fetchOptions = {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: data,
    }

    for (let [key, value] of data.entries()) {
        console.log(key, value);
    }

    const response = await fetch(url + '/project/personal/' + currentProject.id, fetchOptions);
    console.log(response);

    location.href = `../html/myProfile.html?id=${currentProject.author}`;
}

const postEventListener = async (evt) => {
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
    location.href = 'myProfile.html';
}

checkVideoBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const urlSplit = (videoUpload.value).split('=');
    const urlEnding = urlSplit[urlSplit.length - 1];
    console.log('url ending: ',urlEnding);
    checkVideoBtn.style.display = 'none';
    videoUpload.style.display = 'none';
    videoWrapper.innerHTML = `<iframe width="100%" height="100%"  src="https://www.youtube.com/embed/${urlEnding}" title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    removeVideoBtn.style.display = 'block';
    videoWrapper.style.display = 'block';
})

removeVideoBtn.addEventListener('click', (evt) => {
    evt.preventDefault()
    removeVideoBtn.style.display = 'none';
    videoWrapper.style.display = 'none';
    checkVideoBtn.style.display = 'block';
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

deleteBtn.addEventListener('click', async (evt) => {
    evt.preventDefault();

    if (window.confirm('Do you really want to delete this project?')) {
        const fetchOptions = {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            }
        }
        const response = await fetch(url + '/project/personal/' + currentProject.id, fetchOptions);
        console.log(response.json());
        sessionStorage.removeItem('modifying-project');
        window.location.replace('myProfile.html');
    }
})

window.onbeforeunload = () => {
    location.href = 'myProfile.html'
    sessionStorage.removeItem('modifying-project');
}
