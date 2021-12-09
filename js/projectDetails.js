'use strict';
const url = window.GLOBAL_URL;
const yTubeUrl = "https://www.youtube.com/embed/"

let currentUrl = window.location.href;
const projectId = currentUrl.split('=').pop();

let isAuthor;

const checkAuthor = async () => {
    const author = await getProjectAuthor();
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    isAuthor = author === currentUser.userId;
    console.log('is author', isAuthor);
}



//selecting html elements
const projectDetails = document.querySelector('#projectDetails');

const appOverview = document.querySelector('#appOverview');

const vidMedia = document.querySelector('#videoMedia')
const imgMedia = document.querySelector('#imageMedia');
const comments = document.querySelector('#comments');
const longDescription = document.querySelector('#appLongDescription');
const moreInfo = document.querySelector('#moreInfo');
const userInfo = document.querySelector('.user');
// const githubLink = document.querySelector('#github');

let upArrow;
let downArrow;

const createAppOverview = (project, authorId) => {

    projectDetails.innerHTML = '';

    const src = (project.logo) ? url + '/uploads/project/' + project.logo : "../images/logo.png";
    const alt = (project.logo) ? project.name : 'no picture';
    const img = document.createElement('img');
    img.src = url;
    img.alt = alt;

    const nameInCaps = convertNameToCaps(project.name);
    const outline = project.outline;
    const shortDesc = (outline) ? outline.charAt(0).toUpperCase() + outline.slice(1) : '';

    appOverview.innerHTML = '';
    appOverview.innerHTML +=
        `<div id="appOverviewTop">
            <img src="${src}" alt="${alt}" id="projectLogo">
            <div id="nameAuthor">
                <h2>${nameInCaps}</h2>
                <p>${authorId.username}</p>
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
            `<iframe width="100%" height="100%" src="${yTubeUrl + project.video}" title="YouTube video player" frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `

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

const getGitLink = (user, githubLink) => {
    if (!user.github) {
        githubLink.style.visibility = 'hidden';
    } else {
        githubLink.style.backgroundSize = 'cover';
        if (!user.github.includes('http')) {
            githubLink.href = 'http://' + user.github;
        } else {
            githubLink.href = user.github;
        }
        if (user.github.includes('github')) {
            githubLink.style.backgroundImage = "url('../images/github.png')"
        } else if (user.github.includes('gitlab')) {
            githubLink.style.backgroundImage = "url('../images/gitlab.png')"
        } else {
            githubLink.style.backgroundImage = "url('../images/idk.png')"
        }
    }
}

const userInformation = (user) => {
    userInfo.innerHTML =
        `<a href="myProfile.html">
            <img id="userImg" src="${url + '/uploads/user/' + user.profilePic}">
        </a> 
        <div id="userInfo">
            <p id="userName">${user.username}</p>
            <p id="developerType">${user.title}</p>
            <p id="memberSince">${user.creationDate}</p>
        </div>

        <a href="" id="github" target="_blank"></a>`

    projectDetails.appendChild(userInfo)
    const gitLink = document.querySelector('#github');
    getGitLink(user, gitLink)
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
        const fetchOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            }
        }
        if (sessionStorage.getItem('user')) {
           await checkAuthor();
        }
        const route = (isAuthor) ? '/project/personal/' : '/project/';
        console.log('route', route);
        const response = await fetch(url + route + projectId, fetchOptions);
        const project = await response.json();
        console.log('get project response', project)
        const authorResponse = await fetch(url + '/user/' + project.author);
        const authorId = await authorResponse.json();
        //could check here if the author matches the current user!! And use the personal route always
        createAppOverview(project, authorId);
        console.log('author', authorId);
        createAppMedia(project);
        createAppLongDescription(project);
        userInformation(authorId);
    } catch (e) {
        console.log(e.message);
    }
};

const getProjectAuthor = async () => {
    try {
        const fetchOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            }
        }
        const response = await fetch(url + '/project/personal/' + projectId, fetchOptions);
        const json = await response.json();
        return json.author;

    } catch (e) {
        console.log(e.message);
    }

}

getProject();