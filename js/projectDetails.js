/*
* Name: projectDetails.js
* Description: Script handling the functionalities of projectDetails.html
* display all the information about a project and provides functionality
* to the html elements
*/
'use strict';
const url = window.GLOBAL_URL;
const yTubeUrl = "https://www.youtube.com/embed/"

let currentUrl = window.location.href;
const projectId = currentUrl.split('=').pop();

let isAuthor;

const checkAuthor = async () => {
    const author = await getProjectAuthor();
    isAuthor = author === userGlobal.userId;
}

//selecting html elements
const projectDetails = document.querySelector('#projectDetails');
const appOverview = document.querySelector('#appOverview');
let likes;
let rating;
let ownRating;
const vidMedia = document.querySelector('#videoMedia')
const imgMedia = document.querySelector('#imageMedia');
const projectComments = document.querySelector('#comments');
const longDescription = document.querySelector('#appLongDescription');
const userInfo = document.querySelector('.user');

let upArrow;
let downArrow;

//app overview contains details about the app including name, author, outline, logo, rating
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
                <img id="arrow-up" src="../images/arrow-up.png" alt="up-arrow"  onclick="upVote()"/>
                <div id="card-like-count">0</div>
                <img id="arrow-down" src="../images/arrow-down.png" alt="down-arrow" onclick="downVote()"/>
         </div>
         </div>
         
         </div>
         <div id="appOverviewBottom">
           
            <p id="shortDesc">${shortDesc}</p>
         </div>`
    projectDetails.appendChild(appOverview);

    upArrow = document.querySelector('#arrow-up');
    upArrow.style.filter = "invert(100%)";
    downArrow = document.querySelector('#arrow-down');
    downArrow.style.filter = "invert(100%)";

    const appOverviewBottom = document.querySelector('#appOverviewBottom');
    if (!outline) {
        appOverviewBottom.style.display = 'none';
        appOverview.style.minHeight = 'auto';
    }
}

//display the current projects media
const createAppMedia = (project) => {
    //if the project has a video, it is displayed in an embedded youtube player
    if (project.video) {
        vidMedia.innerHTML +=
            `<iframe width="100%" height="100%" src="${yTubeUrl + project.video}" title="YouTube video player" frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `

        projectDetails.appendChild(vidMedia);
    }

    //project images are displayed in a horizontal scrollable list, can be clicked to enlarge
    if (project.images) {
        const images = project.images.split(',');
        images.forEach((image) => {
            const imgSrc = url + '/uploads/project/' + image;
            imgMedia.innerHTML +=
                `<div id="images">
                    <img src="${imgSrc}" alt="${project.name}" class="projectImg zoomD">
                </div>`
        });
        projectDetails.appendChild(imgMedia);
        const imagesToZoom = document.getElementsByClassName("zoomD");
        if (imagesToZoom.length>0) {
            for (let img of imagesToZoom) {
                img.addEventListener("click", zoomImg);
            }
        }
    }
}

//displays the long description about the project
const createAppLongDescription = (project) => {
    longDescription.innerHTML =
        `${project.description}`

    projectDetails.appendChild(longDescription);
}
//creating the input that allows users to add comments about the project loaded
const createAppCommentInput = () => {
    if (userGlobal) {

        const commentInput = document.createElement('div');
        commentInput.innerHTML += `      
            <button id="add-comment-btn" onclick="ShowPopup()">
                <p id="comment-add-text">Add Comment</p> 
                <img id="comment-bubble" src="../images/comment.png">
            </button>
            <div id="inputPopup" class="popup">
                <div class="inputOutline">
                    <h2>Add a comment</h2>
                    <button id="closeBtn">&times</button>
                    <textarea id="input" placeholder="Tell us what is on your mind..." name="addComment" required></textarea>
                    <button id="addBtn">Add</button>
                </div>
            </div>
        `
        projectComments.appendChild(commentInput);
        projectDetails.appendChild(projectComments);

        const popupInput = document.querySelector('#input');
        popupInput.autofocus = true;
        const popupBtnClose = document.querySelector('#closeBtn');
        const popupBtnAdd = document.querySelector('#addBtn');
        popupBtnClose.addEventListener('click', (evt => {
            evt.preventDefault()
            document.getElementById('inputPopup').style.display = ''
            popupInput.value = '';
            body.style.overflowY = 'visible';
        }));
        //click add but on add comment display, inserts and displays the users comment
        popupBtnAdd.addEventListener('click', (evt => {
            evt.preventDefault();
            if (popupInput.value.length > 0) {
                document.getElementById('inputPopup').style.display = ''
                addComment(popupInput.value).then(() => {
                    popupInput.value = '';
                    body.style.overflowY = 'visible';
                });
            }
        }));
        //also when enter key -> keycode === 13, is pressed, comment is inserted
        popupInput.addEventListener("keydown", (evt => {
            if (evt.keyCode === 13) {
                evt.preventDefault();
                if (popupInput.value.length > 0) {
                    document.getElementById('inputPopup').style.display = ''
                    addComment(popupInput.value).then(() => {
                        popupInput.value = '';
                        body.style.overflowY = 'visible';
                    });
                }
            }
        }));
    }
}

//displays a popup element where users can enter a comment about the project
function ShowPopup() {
    const inputPopup = document.getElementById('inputPopup');
    inputPopup.style.display = 'flex';
    body.style.overflowY = 'hidden';
}

async function addComment(comment) {
    const data = {
        "comment": comment,
        "userId": userGlobal.userId,
        "userName": userGlobal.username,
        "projectId": projectId,
    }
    //post methody sends data to insert comment to database
    const fetchOptions = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }
    const response = await fetch(url + '/project/comments/', fetchOptions);
    await response.json();

    await getComments();
}

//displays all comments in relation to the projectId in a scrollable list
const createAppComments = (comments) => {
    const currentList = document.querySelector('#commentList');
    if (currentList) {
        currentList.remove();
    }
    if (comments.length > 0) {
        const commentList = document.createElement('ul');
        commentList.id = 'commentList';
        comments.forEach((comment) => {
            const isAuthor = (userGlobal) ? userGlobal.userId === comment.userId : false;
            console.log('is author', isAuthor);
            commentList.style.backgroundColor = "transparent";
            const commentPic = (!comment.profilePic) ? '../images/profilePic.png' : url + '/thumbnails/user/' + comment.profilePic
            commentList.innerHTML +=
                `<li class="userComment">
                    <a href="../html/myProfile.html?id=${comment.userId}"><img id="comment-pic" src="${commentPic}" alt=""></a>
                    <div id="comment-info">
                        <p id="name" onclick="toProfile(${comment.userId})">${comment.username}</p>
                        <p id="comment">${comment.comment}</p>
                        <p id="comment-date">${comment.timeStamp.split(' ').shift()}</p>
                    </div>
                    ${(isAuthor || userGlobal.role === 1) ? '<img alt="delete" id="comment-delete" src="../images/delete.png" onclick="deleteComment(' + comment.commentId + ')">' : ''}
            </li>`
        });
        projectComments.appendChild(commentList);
        //if user is logged in, comments will be displayed
        if (!userGlobal) {
            projectDetails.appendChild(projectComments)
        }
    }
}

//navigation to user when clicking on their name
function toProfile(userId) {
    location.href = `../html/myProfile.html?id=${userId}`;
}

//displays a different icon dependent if authors link is gitlab, gitHub or other
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

//Section of page containing the authors information
const userInformation = (user) => {
    const imgURL = (user.profilePic) ? url + '/uploads/user/' + user.profilePic : '../images/profilePic.png';
    userInfo.innerHTML =
        `<a href="../html/myProfile.html?id=${user.userId}">
            <img id="userImg" src="${imgURL}" alt="users profile picture">
        </a> 
        <div id="userInfo">
            <p id="userName">${user.username}</p>
            <p id="developerType">${user.title}</p>
            <p id="memberSince">Member since ${user.creationDate.split('-').shift()}</p>
        </div>

        <a href="" id="github" target="_blank"></a>`

    projectDetails.appendChild(userInfo)
    const gitLink = document.querySelector('#github');
    getGitLink(user, gitLink)
}

//AJAX call, Get method to retrieve project details
const getProject = async () => {
    try {
        const fetchOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            }
        }
        if (userGlobal) {
            await checkAuthor();
        }
        //changes the route used base on if the user is the author, or if they are an admin
        let route = (isAuthor) ? '/project/personal/' : '/project/';
        if (userGlobal && userGlobal.role === 1) {route = '/project/admin/'}
        const response = await fetch(url + route + projectId, fetchOptions);
        const project = await response.json();
        const authorResponse = await fetch(url + '/user/' + project.author);
        const authorId = await authorResponse.json();
        createAppOverview(project, authorId);
        await updateRating();
        createAppMedia(project);
        if (project.description) {
            createAppLongDescription(project, authorId);
        }
        createAppCommentInput();
        await getComments();
        userInformation(authorId);
    } catch (e) {
        console.log(e.message);
    }
};
//Gets project author, to be used in checks regarding user rights
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

//get method returns sum of all ratings for project, default value 0 if none exist
const getProjectRating = async () => {
    try {
        const ratingResponse = await fetch(url + '/project/projectRating/' + projectId);
        const projectRating = await ratingResponse.json();
        return (projectRating.rating) ? projectRating.rating : 0;
    } catch (e) {
        console.log(e.message);
    }
}

//get method retrieves users own rating for project
const getOwnRating = async () => {
    try {
        const fetchOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/project/projectRating/own/' + projectId, fetchOptions);
        const fetchedOwnRating = await response.json();

        return fetchedOwnRating.rating;
    } catch (e) {
        console.error(e.message);
    }
}

//changes the rating on screen and shows users current rating for the project
const updateRating = async () => {
    likes = document.querySelector('#card-like-count')
    rating = await getProjectRating();
    if(userGlobal) ownRating = await getOwnRating();
    if (likes) {
        (rating) ? likes.innerHTML = rating.toString() : likes.innerHTML = '0';
    }
    switch (ownRating) {
        case -1:
            downArrow.style.filter = "invert(24%) sepia(59%) saturate(6111%) hue-rotate(337deg) brightness(85%) contrast(104%)";
            upArrow.style.filter = "invert(100%)";
            break;
        case 1:
            upArrow.style.filter = "invert(64%) sepia(76%) saturate(711%) hue-rotate(43deg) brightness(114%) contrast(104%)";
            downArrow.style.filter = "invert(100%)";
            break;
        default:
            downArrow.style.filter = "invert(100%)";
            upArrow.style.filter = "invert(100%)";
            break;

    }
}

const modifyRating = async (rating) => {
    //put method modifies already existing rating
    let fetchOptions = {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            'Content-type': 'application/json',
        },
        body: JSON.stringify({'rating': rating}),
    }

    //post method to insert new rating into database
    if (ownRating === null || ownRating === undefined) {
        console.log('post method');
        fetchOptions = {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-type': 'application/json',
            },
            body: JSON.stringify({'rating': rating}),
        }
    }

    await fetch(url + '/project/projectRating/' + projectId, fetchOptions);
    await updateRating();
}
//get comment list for project from database
const getComments = async () => {
    try {
        const commentResponse = await fetch(url + '/project/comments/' + projectId);
        const comments = await commentResponse.json();
        createAppComments(comments)
    } catch (e) {
        console.log(e.message);
    }
}

//delete comments
const deleteComment = async (commentId) => {
    try {
        const data = {
            'commentId': commentId
        }
        const fetchOptions = {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data),

        }
        //check whether user is admin, admin can delete all comments, users can only delete their own
        const route = (userGlobal.role === 1) ? '/project/comments/admin/' : '/project/comments/';
        await fetch(url + route, fetchOptions);

        await getComments();
    } catch (e) {
        console.log(e.message);
    }
}

getUserGlobal().then(() => {
        getProject();
    })

//Makes first letter of inputted tag capital.
const convertNameToCaps = (name) => {
    const nameArr = name.split(" ");
    for (let i = 0; i < nameArr.length; i++) {
        nameArr[i] = nameArr[i].charAt(0).toUpperCase() + nameArr[i].slice(1);
    }
    return nameArr.join(" ");
}

/*handles the on click event for up vote arrow
top case: when arrow hasn't been pressed
bottom case: when arrow was already pressed
*/
const upVote = () => {
    if (upArrow.style.filter === "invert(100%)") {
        upArrow.style.filter = "invert(64%) sepia(76%) saturate(711%) hue-rotate(43deg) brightness(114%) contrast(104%)";
        downArrow.style.filter = "invert(100%)";
        modifyRating(1);
    } else {
        upArrow.style.filter = "invert(100%)";
        downArrow.style.filter = "invert(100%)";
        modifyRating(0);
    }

}
/*handles the on click event for down vote arrow
top case: when arrow hasn't been pressed
bottom case: when arrow was already pressed
*/
const downVote = () => {
    if (downArrow.style.filter === "invert(100%)") {
        downArrow.style.filter = "invert(24%) sepia(59%) saturate(6111%) hue-rotate(337deg) brightness(85%) contrast(104%)";
        upArrow.style.filter = "invert(100%)";
        modifyRating(-1);
    } else {
        upArrow.style.filter = "invert(100%)";
        downArrow.style.filter = "invert(100%)";
        modifyRating(0);
    }

}

//lightbox, functionality when clicking on images to display them
function zoomImg() {
    const clone = this.cloneNode();
    clone.classList.remove("zoomD");

    let lb = document.querySelector("#lb-img");
    lb.innerHTML = "";
    lb.appendChild(clone);

    lb = document.querySelector("#lb-back");
    lb.classList.add("show");
}

window.addEventListener("load", () => {

    document.querySelector("#lb-back").addEventListener("click", function(){
        this.classList.remove("show");
    })
});

sessionStorage.setItem('projectDetailsVisited', 'true');
