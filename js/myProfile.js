'use strict';
const url = window.GLOBAL_URL;
console.log(url);

let currentUrl = window.location.href;
const wantedUserId = parseInt(currentUrl.split('=').pop());

const userImg = document.getElementById("userImg");
const div = document.querySelector('.personal');
const username = document.querySelector('#userName');
const developerType = document.querySelector('#developerType');
const memberSince = document.querySelector('#memberSince');
const userDesc = document.querySelector('#userDesc');
//TODO below 1
const userTags = document.querySelector('#tags');
const searchBar = document.querySelector('#searchBar');
const searchBarWithFilter = document.querySelector('.search-with-filter')
const githubLink = document.querySelector('#github');
const fab = document.querySelector('#fab-add-project');

let isOwnProfile;

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
    /* TODO general styling of tags */
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

const userProjects = document.querySelector('#userProjects');

const createProjectCard = (projects) => {
    //clear user projects
    userProjects.innerHTML = '';

    if (projects.length > 0) {

        projects.forEach((project) => {
            const logoURL = (project.logo) ? url + '/thumbnails/project/' + project.logo : '../images/logo.png';
            const privateProject = project.private === 1;
            const thumbUpDown = (project.rating < 0) ? -1 : 1;

            userProjects.innerHTML +=
                `<div id="project-card-container" class=${(isOwnProfile) ? 'animatedContainer' : ''}>
                <a id="card-link" href="../html/projectDetails.html?id=${project.id}" >
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
                <button id="editBtn" onclick="toEditProject(${project.id})">Edit</button>
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

function toEditProject(projectId) {
    if(isOwnProfile) {
        sessionStorage.setItem('modifying-project', 'true');
        location.href = `../html/projectUpload.html?id=${projectId}`
    }
}

const deleteProject = async (projectId) => {
    //somehow get the button reference here...

    if (window.confirm('Do you really want to delete this project?')) {
        const fetchOptions = {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            }
        }
        console.log('projectList', projectId);
        const response = await fetch(url + '/project/personal/' + projectId, fetchOptions);
        console.log(await response.json());
        await displayPersonalProjects();
    }
}

function author(project) {

    if (project.author === wantedUserId) {
        return project
    }
}
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

const displayPersonalProjects = async () => {

    try {
        const fetchOptions = {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };

        let route;
        let admin = false;
        if (!sessionStorage.getItem('token')) {
            route = '/project';
        } else {
            if (userGlobal) {
                if (userGlobal.role === 1) {
                    route = '/project/admin/';
                    admin = true;
                } else if (isOwnProfile) {
                    route = '/project/personal'
                } else {
                    route = '/project';
                }
            } else {
                console.log('userglobal not defined ;)')
            }
        }
        console.log('route displayproject', route)
        console.log('userglobal route displayproject', userGlobal)
        const response = await fetch(url + route, fetchOptions);
        const projects = await response.json();
        console.log(projects);
        const userProjects = (admin) ? projects : projects.filter(author);
        projectList = userProjects;
        console.log('userProjects', userProjects);
        createProjectCard(userProjects);
    } catch (e) {
        console.log(e.message);
    }
};



function filterBtn() {
    document.getElementById("myDropdown").classList.toggle("show");
}



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

function filter(filterChoice) {
    console.log(filterChoice);
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
    }
}

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

fab.addEventListener('click', () => {
    location.href = 'projectUpload.html';
})

window.onpageshow = () => {
    getUserGlobal().then(() => {
        isOwnProfile = (userGlobal) ? wantedUserId === userGlobal.userId : false;

        if (isOwnProfile) {
            updateUserInfo(userGlobal);
            displayPersonalProjects()
        } else {
            displayUserInfo().then(() => {
                displayPersonalProjects();
            });
        }
        if (sessionStorage.getItem('projectDetailsVisited')) {
            sessionStorage.removeItem('projectDetailsVisited');
            location.reload();
        }
    })
}




