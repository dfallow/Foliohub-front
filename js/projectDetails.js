'use strict';
const url = window.GLOBAL_URL;
console.log(url);

let currentUrl = window.location.href;
const projectId = currentUrl.split('=').pop();
const drawer = document.querySelector('#side-menu');


//selecting html elements
const projectDetails = document.querySelector('#projectDetails');

const appOverview = document.querySelector('#appOverview');

const media = document.querySelector('#media');
const comments = document.querySelector('#comments');
const moreInfo = document.querySelector('#moreInfo');

let upArrow;
let downArrow;

const createAppOverview = (project) => {

    projectDetails.innerHTML = '';

    const src = (project.images) ? url + '/' + project.images : "../images/logo.png";
    const alt = (project.images) ? project.name : 'no picture';
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;

    appOverview.innerHTML = '';
    appOverview.innerHTML +=
        `<div id="appOverviewTop">
            <img src="${src}" alt="${alt}">
            <div id="nameAuthor">
                <h2>${project.name}</h2>
                <p>Author</p>
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
            <p id="shortDesc">${project.description}</p>
         </div>`
    projectDetails.appendChild(appOverview);

    upArrow = document.querySelector('#arrow-up');
    downArrow = document.querySelector('#arrow-down');

}

const createAppMedia = (project) => {
    if (project.video) {
        media.innerHTML +=
            `<div id="video">
                <iframe width="560" height="315" src="${project.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>`
    }
    if (project.images) {
        const images = project.images;
        images.forEach(
            media.innerHTML +=
                `<div id="images">
                
                </div>`
        );

    }

    projectDetails.appendChild(media);
}

const createAppLongDescription = (project) => {

}

const createAppComments = (project) => {

}

const createAppMoreInfo = (project) => {

}

const createSimilarApps = (project) => {

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

/*const createProjectDetails = (project) => {
    //clear project details
    //projectDetails.innerHTML = '';

    const src = (project.images) ? url + '/' + project.images : "../images/logo.png";
    const alt = (project.images) ? project.name : 'no picture';
    //App logo in appOverview
    const logo = document.createElement('img');

    projectDetails.appendChild(logo);

    const figure = document.createElement('figure').appendChild(logo);

    const appName = document.createElement('h3');
    appName.innerHTML = project.name;

    const author = document.createElement('h4');
    author.innerHTML = "Author";

    const tags = document.createElement('ul');
    // TODO tags need to be implemneted first
    tags.innerHTML = '';

    const votes = document.createElement('ul')
    votes.id = "votes"

    //const upVote = document.createElement()

    const descriptionShort = document.createElement('p');
    descriptionShort.innerHTML = project.description;

    const downloadBtn = document.createElement('button')

    appOverviewTop.appendChild(figure);
    appOverviewTop.appendChild(appName);
    appOverviewTop.appendChild(author);
    appOverviewTop.appendChild(tags);
    appOverviewTop.appendChild(votes);
    appOverviewTop.appendChild(descriptionShort);
    appOverviewTop.appendChild(downloadBtn);

    appOverview.appendChild(appOverviewTop);
    projectDetails.appendChild(appOverview);




}*/

//AJAX call
const getProject = async () => {
    try {
        const response = await fetch(url + '/project/' + projectId);
        const project = await response.json();
        console.log(project)
        //const authorResponse = await fetch(url + '/user/' + project.author);
        //const authorId = await authorResponse.json();
        //console.log(authorId);
        createAppOverview(project);
        createAppMedia(project);
    } catch (e) {
        console.log(e.message);
    }
};
getProject();

function openDrawer() {
    drawer.style.visibility = 'visible';
    drawer.style.width = '70vw';
}

function closeDrawer() {
    drawer.style.visibility = 'hidden';
    drawer.style.width = '0';

}