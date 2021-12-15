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
let likes;
let rating;
let ownRating;
const vidMedia = document.querySelector('#videoMedia')
const imgMedia = document.querySelector('#imageMedia');
const projectComments = document.querySelector('#comments');
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
                <div id="card-like-count">0</div>
                <img id="arrow-down" src="../images/arrow-down.png" alt="down-arrow" onclick="downVote()"/>
         </div>
         </div>
         
         </div>
         <div id="appOverviewBottom">
            <div style="display: none" id="cardTags">
                    <!-- TODO tags to be added here -->
                    <p>Tags will go here</p>
            </div>
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
    ;
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
        `${project.description}`

    projectDetails.appendChild(longDescription);
}

const createAppCommentInput = () => {
    if (sessionStorage.getItem('user')) {

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

function ShowPopup() {
    const inputPopup = document.getElementById('inputPopup');
    inputPopup.style.display = 'flex';
    body.style.overflowY = 'hidden';
}

async function addComment(comment) {
    const data = {
        "comment": comment,
        "userId": user.userId,
        "userName": user.username,
        "projectId": projectId,
    }
    console.log(data);
    const fetchOptions = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }

    const response = await fetch(url + '/project/comments/', fetchOptions);
    const json = await response.json();
    console.log(json);

    await getComments();
}

const createAppComments = (comments) => {
    const currentList = document.querySelector('#commentList');
    if (currentList) {
        currentList.remove();
    }
    if (comments.length > 0) {
        const commentList = document.createElement('ul');
        commentList.id = 'commentList';
        comments.forEach((comment) => {
            const isAuthor = user.userId === comment.userId;
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
                    ${(isAuthor) ? '<img id="comment-delete" src="../images/delete.png" onclick="deleteComment(' + comment.commentId + ')">' : ''}
            </li>`
        });
        const commentSection = document.querySelector('#comments')
        commentSection.appendChild(commentList);
        // projectDetails.appendChild(projectComments);
    }
}

function toProfile(userId) {
    location.href = `../html/myProfile.html?id=${userId}`;
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
        createAppOverview(project, authorId);
        await updateRating();
        console.log('author', authorId);
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

const getProjectRating = async () => {
    try {
        const ratingResponse = await fetch(url + '/project/projectRating/' + projectId);
        const projectRating = await ratingResponse.json();
        console.log('project rating', projectRating.rating);
        return (projectRating.rating) ? projectRating.rating : 0;
    } catch (e) {
        console.log(e.message);
    }
}

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
        const ownRatingRating = fetchedOwnRating.rating;
        console.log('fetchedOwnRating', ownRatingRating);
        return ownRatingRating;
    } catch (e) {
        console.error(e.message);
    }
}

const updateRating = async () => {
    likes = document.querySelector('#card-like-count')
    rating = await getProjectRating();
    ownRating = await getOwnRating();
    console.log('rating', rating);
    console.log('own rating', ownRating);
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

const insertRating = async () => {

}

console.log('test null', 0 === null);

const modifyRating = async (rating) => {
    console.log('is ownRating undefined?', ownRating);
    let fetchOptions = {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            'Content-type': 'application/json',
        },
        body: JSON.stringify({'rating': rating}),
    }

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

    console.log('fetchOptions', fetchOptions);
    const response = await fetch(url + '/project/projectRating/' + projectId, fetchOptions);
    // console.log(await response.json());
    await updateRating();
}

const getComments = async () => {
    try {
        const fetchOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            }
        }
        const commentResponse = await fetch(url + '/project/comments/' + projectId, fetchOptions);
        const comments = await commentResponse.json();
        createAppComments(comments)
    } catch (e) {
        console.log(e.message);
    }
}

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
        const commentResponse = await fetch(url + '/project/comments/', fetchOptions);
        const comments = await commentResponse.json();

        console.log(comments);

        await getComments();
    } catch (e) {
        console.log(e.message);
    }
}

getProject();

const convertNameToCaps = (name) => {
    const nameArr = name.split(" ");
    for (let i = 0; i < nameArr.length; i++) {
        nameArr[i] = nameArr[i].charAt(0).toUpperCase() + nameArr[i].slice(1);
    }
    return nameArr.join(" ");

}
const upVote = () => {
    if (upArrow.style.filter === "invert(100%)") {
        // TODO insert/modify rating to be 1

        upArrow.style.filter = "invert(64%) sepia(76%) saturate(711%) hue-rotate(43deg) brightness(114%) contrast(104%)";
        downArrow.style.filter = "invert(100%)";
        modifyRating(1);
    } else {
        // TODO modify rating to be 0
        upArrow.style.filter = "invert(100%)";
        downArrow.style.filter = "invert(100%)";
        modifyRating(0);
    }

}
const downVote = () => {
    if (downArrow.style.filter === "invert(100%)") {
        // TODO insert/modify rating to be -1
        downArrow.style.filter = "invert(24%) sepia(59%) saturate(6111%) hue-rotate(337deg) brightness(85%) contrast(104%)";
        upArrow.style.filter = "invert(100%)";
        modifyRating(-1);
    } else {
        //TODO modify rating to be 0
        upArrow.style.filter = "invert(100%)";
        downArrow.style.filter = "invert(100%)";
        modifyRating(0);
    }

}

sessionStorage.setItem('projectDetailsVisited', 'true');
