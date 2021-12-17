/*
* Name:myProfile.js
* Script handling the functionalities of myProfile.
* Creates and shows the user information and also shows
* the users own project. If the user is an admin all projects
* are displayed*
 */
'use strict';
const url = window.GLOBAL_URL;

let currentUrl = window.location.href;
const wantedUserId = parseInt(currentUrl.split('=').pop());

//selecting html elements
const userImg = document.getElementById("userImg");
const div = document.querySelector('.personal');
const username = document.querySelector('#userName');
const developerType = document.querySelector('#developerType');
const memberSince = document.querySelector('#memberSince');
const userDesc = document.querySelector('#userDesc');
const userTags = document.querySelector('#tags');
const searchBar = document.querySelector('#searchBar');
const searchBarWithFilter = document.querySelector('.search-with-filter')
const githubLink = document.querySelector('#github');
const fab = document.querySelector('#fab-add-project');
const userProjects = document.querySelector('#userProjects');

let isOwnProfile;
let isAdmin;

//displays the information of the user profile it belongs to
function updateUserInfo(userInfo) {
    if (userInfo.profilePic) {
        userImg.src = url + '/uploads/user/' + userInfo.profilePic;
        userImg.alt = "user profile pic";
    }
    username.innerHTML = userInfo.username;
    developerType.innerHTML = userInfo.title;
    memberSince.innerHTML = `Member since ${userInfo.creationDate.split('-').shift()}`;
    if (!userInfo.description) {
        userDesc.style.display = 'none';
    }
    userDesc.innerHTML = userInfo.description;
    if (userInfo.tags) {
        const tags = userInfo.tags.split(',');
        tags.forEach((tag) => {
            userTags.innerHTML += `<p>${tag}</p>`;
        });
    }
    if (!userInfo.github) {
        githubLink.style.visibility = 'hidden';
    } else {
        githubLink.style.backgroundSize = 'cover';
        if (!userInfo.github.includes('http')) {
            githubLink.href = 'http://' + userInfo.github;
        } else {
            githubLink.href = userInfo.github;
        }
        if (userInfo.github.includes('github')) {
            githubLink.style.backgroundImage = "url('../images/github.png')"
        } else if (userInfo.github.includes('gitlab')) {
            githubLink.style.backgroundImage = "url('../images/gitlab.png')"
        } else {
            githubLink.style.backgroundImage = "url('../images/idk.png')"
        }
    }

}

//creates a project card for each of the users projects and adds them
//to the list. If user is admin or it is their own profile has the option
//to delete/edit
const createProjectCard = (projects) => {
    userProjects.innerHTML = '';

    if (projects.length > 0) {

        projects.forEach((project) => {
            const logoURL = (project.logo) ? url + '/thumbnails/project/' + project.logo : '../images/logo.png';
            const privateProject = project.private === 1;
            const thumbUpDown = (project.rating < 0) ? -1 : 1;
            const cardLinkStyle = `flex-grow: ${(!isOwnProfile) ? '1' : '0'};`
            const editBtn = (isOwnProfile || isAdmin) ? `<button id="editBtn" onClick="toEditProject(${project.id})">Edit</button>` : '';

            userProjects.innerHTML +=
                `<div id="project-card-container" class=${(isOwnProfile || isAdmin) ? 'animatedContainer' : ''}>
                <a id="card-link" href="../html/projectDetails.html?id=${project.id}" style="${cardLinkStyle}" >
                    <li id="projectCard">
                        <figure id="projectImg">
                            <img src="${logoURL}" alt="project.name">
                        </figure>
                        <div id="projectDetailDiv">
                            <h3 id="projectName">${project.name}</h3>
                            <p id="shortDesc">${project.outline}</p>
                            <div id="project-info">
                                <div id="comment-count">
                                    <img src="../images/comment.png" alt="">
                                    <p>${project.comments} </p>
                                </div>
                                <div id="rating">
                                    <img src="../images/like.png" alt="" style="transform: scaleY(${thumbUpDown})">
                                    <p>${project.rating}</p>    
                                </div>
                                <div id="private-indicator" style="visibility: ${(privateProject) ? 'visible' : 'hidden'}">
                                    <img src="../images/lock.png" alt="">
                                    <p>Private</p>   
                                </div>
                                <p id="date">${project.date.split(' ').shift()}</p>
                            </div>
                            
                        </div>
                    </li>
                </a>
                ${editBtn}
                <button id="deleteBtn" onclick="deleteProject(${project.id})">Delete</button>
            </div>`
        });
    } else {
        searchBarWithFilter.style.display = 'none';
        userProjects.innerHTML = `
             <p style="font-size: 100px; margin: 0; padding-top: 4vh">🐣</p>
             <p id="not-found" style="color: rgba(255,255,255,0.7); font-size: 30px">No projects yet? Try adding one by clicking the + button</p>
        `
    }
}

//navigate to project upload where user can modify the selected project
function toEditProject(projectId) {
    if(isOwnProfile || isAdmin) {
        sessionStorage.setItem('modifying-project', 'true');
        location.href = `../html/projectUpload.html?id=${projectId}`
    }
}

//confirms whether the user wants to delete the project
const deleteProject = async (projectId) => {

    if (window.confirm('Do you really want to delete this project?')) {
        const fetchOptions = {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            }
        }
        const route = (isAdmin) ? '/project/admin/' : '/project/personal/' ;
        await fetch(url + route + projectId, fetchOptions);
        await displayPersonalProjects();
    }
}

//used to check if a project belongs to the user
function author(project) {
    if (project.author === wantedUserId) {
        return project
    }
}
//gets the profile information of the user requested
const displayUserInfo = async () => {
    try {
        const response = await fetch(url + '/user/' + wantedUserId);
        const userInfo = await response.json();
        updateUserInfo(userInfo);
    } catch (e) {
        console.log()
    }
}
let projectList;

//displays all the projects that are associated with the user
//checks if the user is logged in and whether it is their profile
//or they are an admin
const displayPersonalProjects = async () => {
    try {
        const fetchOptions = {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };

        let route;
        if (!sessionStorage.getItem('token')) {
            route = '/project';
        } else {
            if (userGlobal) {
                if (userGlobal.role === 1) {
                    route = '/project/admin/';
                } else if (isOwnProfile) {
                    route = '/project/personal'
                } else {
                    route = '/project';
                }
            } else {
                console.log('userglobal not defined ;)')
            }
        }
        const response = await fetch(url + route, fetchOptions);
        const projects = await response.json();
        const userProjects = (isAdmin && isOwnProfile) ? projects : projects.filter(author);
        projectList = userProjects;
        createProjectCard(userProjects);
    } catch (e) {
        console.log(e.message);
    }
};

// closing dropdown when clicking somewhere else
window.onclick = function (event) {
    if (!event.target.matches('.filterBtn')) {
        let dropdowns = document.getElementsByClassName("filterOptions");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// sorting projects by date of creation, name, ratings, comments and privacy.
function sort(filterChoice) {
    let listClone = [...projectList];
    switch (filterChoice) {
        case 'newest':
            createProjectCard(projectList);
            break;
        case 'oldest':
            createProjectCard(listClone.reverse());
            break;
        case 'aZ':
            listClone.sort(function (a, b) {
                if (a.name.toUpperCase() < b.name.toUpperCase()) {
                    return -1;
                }
                if (a.name.toUpperCase() > b.name.toUpperCase()) {
                    return 1;
                }
                return 0;
            })
            createProjectCard(listClone);
            break;
        case 'zA':
            listClone.sort(function (a, b) {
                if (a.name.toUpperCase() > b.name.toUpperCase()) {
                    return 1;
                }
                if (a.name.toUpperCase() < b.name.toUpperCase()) {
                    return -1;
                }
                return 0;
            })
            createProjectCard(listClone.reverse());
            break;
        case 'rating':
            listClone.sort(function (a,b){
                if (a.rating > b.rating) {return 1; }
                if (a.rating < b.rating) {return -1; }
                return 0;
            })
            createProjectCard(listClone.reverse());
            break;
        case 'comments':
            listClone.sort(function (a,b){
                if (a.comments > b.comments) {return 1; }
                if (a.comments < b.comments) {return -1; }
                return 0;
            })
            createProjectCard(listClone.reverse());
            break;
        case 'privacy':
            listClone.sort(function (a,b){
                if (a.private > b.private) {return 1; }
                if (a.private < b.private) {return -1; }
                return 0;
            })
            createProjectCard(listClone.reverse());
            break;
    }
}

// searching projects by name. if no result, message not found
searchBar.addEventListener('input', (evt) => {
    setTimeout(() => {
        searchBarFilter(searchBar.value);
    }, 500)
})
function searchBarFilter(string) {
    let listClone = [...projectList];
    if (string.length === 0) {
        createProjectCard(projectList)
    } else {
        const filtered = listClone.filter(project => project.name.toLowerCase().includes(string.toLowerCase()));
        if (filtered.length === 0) {
            userProjects.innerHTML = `
                <p style="font-size: 100px; margin: 0">🔍</p>
                <p id="not-found" style="color: rgba(255,255,255,0.7); font-size: 30px">No result found for '${string}'</p>
            `
        } else {
            createProjectCard(filtered);
        }
    }
}

// redirect to project upload with floating action button
fab.addEventListener('click', () => {
    location.href = 'projectUpload.html';
})

// when the page appears, checks if a user is visiting its own profile and if the user is an admin.
// if the user is visiting its own profile, the user info is fetched from the userGlobal variable which
// is retrieved thanks to user token, if not, it is fetched from the database. then the projects are displayed
window.onpageshow = () => {
    getUserGlobal().then(() => {
        isOwnProfile = (userGlobal) ? wantedUserId === userGlobal.userId : false;
        isAdmin = (userGlobal && userGlobal.role === 1);
        if (isOwnProfile) {
            updateUserInfo(userGlobal);
            displayPersonalProjects()
        } else {
            displayUserInfo().then(() => {
                displayPersonalProjects();
            });
        }
        // reloading the page if it was accessed via the back button from the project details page.
        // if not reloaded, the stats won't refresh on the project cards.
        if (sessionStorage.getItem('projectDetailsVisited')) {
            sessionStorage.removeItem('projectDetailsVisited');
            location.reload();
        }
    })
}




