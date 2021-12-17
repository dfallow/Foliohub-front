/*
* Name: projectUpload.js
* Description: Script for uploading a new project, deleting a project, modifying a project
*/

'use strict';
const url = window.GLOBAL_URL;

//Form
const form = document.querySelector('#uploadDetails')
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
//buttons
const submitBtn = document.querySelector('#submit-btn');
const deleteBtn = document.querySelector('#deleteBtn');
const checkbox = document.querySelector('#private');

form.action = url + '/project';
form.method = 'post';

// Array to store uploaded images
const picturesArray = [];

let currentProject;
let isAdmin;

const modifyingProject = sessionStorage.getItem('modifying-project') === 'true';

// Get project for setting as current project
const getProject = async (projectId) => {
    try {
        const fetchOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        }
        // If user is admin use route for admin otherwise user users personal route and return wanted project
        // based on project id
        const route = (isAdmin) ? '/project/admin/' : '/project/personal/';
        const response = await fetch(url + route + projectId, fetchOptions);
        return await response.json();
    } catch (e) {
        console.log(e.message);
    }
};

// Get project with id then set it as current project
const setCurrentProject = async (id) => {
    currentProject = await getProject(id);
}

// Fetching url and converting that into a file object
const urlToObject = async (url, filename) => {
    const response = await fetch(url);
    // here image is url/location of image
    const blob = await response.blob();
    return new File([blob], `${filename}`, {type: blob.type});
}

// Initializing new DataTransfers
let imageFiles = new DataTransfer();
let logoFile = new DataTransfer();

// Storing DataTransfer objects of project images in imageFiles
const createDataTransfer = async (strings) => {
    for (const string of strings) {
        imageFiles.items.add(await urlToObject(url + '/uploads/project/' + string, string));
    }
}

// Storing DataTransfer object of project logo into logoFile
const logoToDataTransfer = async (string) => {
    logoFile.items.add(await urlToObject(url + '/uploads/project/' + string, string))
}

// Checks if user is modifying a project instead of creating a new one
if (modifyingProject) {
    let currentUrl = window.location.href;
    const projectId = currentUrl.split('=').pop();
    // Getting user info from token
    getUserGlobal().then(() => {
        // Setting admin when role is 1
        isAdmin = (userGlobal && userGlobal.role === 1);

        // Setting all existing values the input fields
        setCurrentProject(projectId).then(() => {
            // Displays a logo if project has one. Takes it from logo DataTransfer
            if (currentProject.logo) {
                logoToDataTransfer(currentProject.logo).then(() => {
                    imageUpload.files = logoFile.files
                    displayProjectLogo(url + '/uploads/project/' + currentProject.logo);
                });
            }
            // All input fields on form that can be updated
            const inputs = form.querySelectorAll('input');
            const longTextarea = form.querySelector('#longDescTextArea');
            const shortTextarea = form.querySelector('#shortDescTextArea');
            const uploadedPictures = form.querySelector('#uploadedPictures');

            // If project has images, takes data them from DataTransfer and pushes filenames into picturesArray
            // then updates to display them
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
            // storing values into input fields if exist
            inputs[1].value = (!currentProject.name) ? '' : currentProject.name;
            shortTextarea.value = (!currentProject.outline) ? '' : currentProject.outline;
            inputs[2].value = (!currentProject.tags) ? '' : currentProject.tags;
            inputs[3].value = (!currentProject.video) ? '' : currentProject.video;
            longTextarea.value = (!currentProject.description) ? '' : currentProject.description;
            inputs[5].checked = currentProject.private === 1;
        })
        // When modifying change save button to update and display a delete project button
        submitBtn.innerHTML = 'Update';
        deleteBtn.style.display = 'block';
        deleteBtn.style.backgroundColor = 'red';
        deleteBtn.style.color = 'white';
    })
}

// Submit the form based on if modifying or not. Changes between put and post methods
// If modifying then put (update) method otherwise post (create new)
form.addEventListener('submit', (evt => {
    (modifyingProject) ? putEventListener(evt) : postEventListener(evt)
}))

// Update project route
const putEventListener = async (evt) => {
    sessionStorage.removeItem('modifying-project');
    evt.preventDefault();
    // Images stored into picturesArray
    let imageFiles = new DataTransfer();
    picturesArray.forEach((file) => { imageFiles.items.add(file) })
    picturesUpload.files = imageFiles.files;
    // If videoUpload has a value split the url from equals sign to get the ending part of
    // a YouTube link that we can store in the database
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
    // Choosing the route based on admin status and redirect back to users profile page
    const route = (isAdmin) ? '/project/admin/' : '/project/personal/';
    await fetch(url + route + currentProject.id, fetchOptions);
    location.href = `../html/myProfile.html?id=${currentProject.author}`;
}

// Post new project
const postEventListener = async (evt) => {
    evt.preventDefault();
    // Images stored into picturesArray
    let imageFiles = new DataTransfer();
    picturesArray.forEach((file) => {
        imageFiles.items.add(file)
    })
    // If videoUpload has a value split the url from equals sign to get the ending part of
    // a YouTube link that we can store in the database
    picturesUpload.files = imageFiles.files;
    if (videoUpload.value) {
        const urlSplit = (videoUpload.value).split('=');
        videoUpload.value = urlSplit[urlSplit.length - 1];
    }
    const data = new FormData(form);
    data.append('private', (checkbox.checked) ? '1' : '0');

    const fetchOptions = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: data,
    }
    // Post project and redirect back to users profile
    await fetch(url + '/project/personal', fetchOptions);
    location.href = `../html/myProfile.html?id=${userGlobal.userId}`;
}

// On click listener for check video link button, displays embedded video if link is correct
checkVideoBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const urlSplit = (videoUpload.value).split('=');
    const urlEnding = urlSplit[urlSplit.length - 1];
    // If urlEnding is not empty display embedded YouTube player
    if (urlEnding !== "") {
        checkVideoBtn.style.display = 'none';
        videoUpload.style.display = 'none';
        videoWrapper.innerHTML = `<iframe width="100%" height="100%"  src="https://www.youtube.com/embed/${urlEnding}" title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        removeVideoBtn.style.display = 'block';
        videoWrapper.style.display = 'block';
        videoUpload.style.color = 'black';
        videoUpload.style.boxShadow = "none";
        videoUpload.placeholder = 'Add Youtube URL...';
    } else {
        videoUpload.style.boxShadow = '0 0 5px 5px red';
        videoUpload.placeholder = 'Give me a url?';
    }

})

// When embedded video is visible you are able to remove the video by pressing Remove button
removeVideoBtn.addEventListener('click', (evt) => {
    evt.preventDefault()
    videoUpload.style.boxShadow = 'none';
    removeVideoBtn.style.display = 'none';
    videoWrapper.style.display = 'none';
    checkVideoBtn.style.display = 'block';
    videoUpload.style.display = 'block';
    videoUpload.value = '';
})

// When uploading an image it will push it to picturesArray. Maximum 6 images can be pushed to picturesArray.
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

// Update uploadedPictures div with existing or newly added images.
// Every time new images is added if displays it by going through the array
function updatePictures() {
    uploadedPics.innerHTML = '';
    picturesArray.forEach((pic, index) => {
        const url = URL.createObjectURL(pic);
        uploadedPics.innerHTML += `<div class="uploadedPic-container" style="position: relative;">
                                      <img class="uploaded-pic" src="${url}">
                                      <div id="hoverDeletePic"onclick="remove(${index})"><img id="trash" src="../images/trash-can-solid.svg"></div>
                                      <div id="imgDelete" onclick="remove(${index})"><span id="times">&times;</span></div>
                                   </div>`
    })
}

// Remove uploaded image from array
function remove(index) {
    picturesArray.splice(index, 1);
    updatePictures();
}

// displaying the currently selected logo
imageUpload.addEventListener('change', (evt) => {
    const image = imageUpload.files[0];
    const url = URL.createObjectURL(image);
    displayProjectLogo(url);
})

// display an image instead of the logo input placeholder
function displayProjectLogo(url) {
    regProjectsPic.style.backgroundImage = `url(${url})`
    regProjectsPic.style.backgroundSize = 'cover';
    regProjectsPic.style.backgroundPosition = 'center center';
    customFileUpload.style.opacity = '0';
    customFileUpload.style.height = '35vw';
    customFileUpload.style.borderRadius = '50%';
    customFileUpload.style.width = '35vw';
}

// deleting project with confirmation
deleteBtn.addEventListener('click', async (evt) => {
    evt.preventDefault();
    if (window.confirm('Do you really want to delete this project?')) {
        const fetchOptions = {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            }
        }
        await fetch(url + '/project/personal/' + currentProject.id, fetchOptions);
        // removing item that indicates the project is being updated
        // and not inserted from sessionStorage and redirecting to myProfile
        sessionStorage.removeItem('modifying-project');
        window.location.replace(`myProfile.html?id=${currentProject.author}`);
    }
})


// removing item that indicates the project is being updated and not inserted from sessionStorage
// just in case the page is left without updating the project
window.onbeforeunload = () => {
    sessionStorage.removeItem('modifying-project');
}
