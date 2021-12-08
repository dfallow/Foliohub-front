'use strict';
const url = window.GLOBAL_URL;
const yTubeUrl = "https://www.youtube.com/embed/"

let currentUrl = window.location.href;
const projectId = currentUrl.split('=').pop();

//selecting html elements
const projectDetails = document.querySelector('#projectDetails');

const appOverview = document.querySelector('#appOverview');

const vidMedia = document.querySelector('#videoMedia')
const imgMedia = document.querySelector('#imageMedia');
const comments = document.querySelector('#comments');
const longDescription = document.querySelector('#appLongDescription');
const moreInfo = document.querySelector('#moreInfo');

let upArrow;
let downArrow;

const createAppOverview = (project, author) => {

    projectDetails.innerHTML = '';

    const src = (project.logo) ? url + '/uploads/project/' + project.logo : "../images/logo.png";
    const alt = (project.logo) ? project.name : 'no picture';
    const img = document.createElement('img');
    img.src = url;
    img.alt = alt;

    const nameInCaps = convertNameToCaps(project.name);
    const outline = project.outline;
    const shortDesc = outline.charAt(0).toUpperCase() + outline.slice(1);

    appOverview.innerHTML = '';
    appOverview.innerHTML +=
        `<div id="appOverviewTop">
            <img src="${src}" alt="${alt}" id="projectLogo">
            <div id="nameAuthor">
                <h2>${nameInCaps}</h2>
                <p>${author}</p>
            </div>
            <div id="card-likes">
                <img id="arrow-up" src="../images/arrow-up.png" alt="up-arrow" onclick="upVote()"/>
                <div id="card-like-count">9999</div>
                <img id="arrow-down" src="../images/arrow-down.png" alt="down-arrow" onclick="downVote()"/>
         </div>
         </div>
         
         </div>
         <div id="appOverviewBottom">
            <div id="cardTags">
                    <!-- TODO tags to be added here -->
                    <p>Tags will go here</p>
            </div>
            <p id="shortDesc">${shortDesc}</p>
         </div>`
    projectDetails.appendChild(appOverview);

    upArrow = document.querySelector('#arrow-up');
    downArrow = document.querySelector('#arrow-down');

}

const createAppMedia = (project) => {
    if (project.video) {
        vidMedia.innerHTML +=
            `<div id="video">
                <iframe width="100%" height="100%" src="${yTubeUrl + project.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>`

        projectDetails.appendChild(vidMedia);
    }

    if (project.images) {
        const images = project.images.split(',');
        images.forEach((image) => {
            const imgSrc = url + '/uploads/project/' + image;
            imgMedia.innerHTML +=
                `<div id="images">
                    <img src="${imgSrc}" alt="${project.name}" class="projectImg">
                </div>`
        });
        projectDetails.appendChild(imgMedia);

    }
}

const createAppLongDescription = (project) => {
    longDescription.innerHTML =
        `<p>${project.description}</p>`

    projectDetails.appendChild(longDescription);
}

const createAppComments = (project) => {

}

const createAppMoreInfo = (project) => {

}

const createSimilarApps = (project) => {

}

const convertNameToCaps = (name) => {
    const nameArr = name.split(" ");
    for (let i = 0; i < nameArr.length; i++) {
        nameArr[i] = nameArr[i].charAt(0).toUpperCase() + nameArr[i].slice(1);
    }
    return nameArr.join(" ");
}

const upVote = (project) => {
    if (upArrow.style.backgroundColor === "green") {
        upArrow.style.backgroundColor = "white";
    } else {
        upArrow.style.backgroundColor = "green";
        downArrow.style.backgroundColor = "white";
    }
}

const downVote = (project) => {
    if (downArrow.style.backgroundColor === "red") {
        downArrow.style.backgroundColor = "white";
    } else {
        upArrow.style.backgroundColor = "white";
        downArrow.style.backgroundColor = "red";
    }
}

//AJAX call
const getProject = async () => {
    try {
        const response = await fetch(url + '/project/' + projectId);
        const project = await response.json();
        const authorResponse = await fetch(url + '/user/' + project.author);
        const authorId = await authorResponse.json();
        const author = authorId.username;
        createAppOverview(project, author);
        createAppMedia(project);
        createAppLongDescription(project);
    } catch (e) {
        console.log(e.message);
    }
};
getProject();