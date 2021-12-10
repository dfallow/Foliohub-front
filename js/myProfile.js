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

const currentUser = JSON.parse(sessionStorage.getItem('user'));

const isOwnProfile = wantedUserId === currentUser.userId;
console.log('isOwnProfile', isOwnProfile);

console.log('Current user: ', currentUser);

function updateUserInfo(userInfo) {
    if (userInfo.profilePic) {
        userImg.src = url + '/uploads/user/' + userInfo.profilePic;
        userImg.alt = "user profile pic";
    }
    username.innerHTML = userInfo.username;
    developerType.innerHTML = userInfo.title;
    memberSince.innerHTML = userInfo.creationDate;
    if (!userInfo.description) {
        userDesc.style.display = 'none';
    }
    userDesc.innerHTML = userInfo.description;
}

const userProjects = document.querySelector('#userProjects');

const createProjectCard = (projects) => {
    //clear user projects
    userProjects.innerHTML = '';

    //const orderedProjects = projects.

    projects.forEach((project) => {
        const logoURL = (project.logo) ? url + '/uploads/project/' + project.logo : '../images/logo.png';

        userProjects.innerHTML +=
            `<div id="project-card-container">
                <a id="card-link" href="../html/projectDetails.html?id=${project.id}" style="width: ${(isOwnProfile) ? '90%' : '100%'}">
                    <li id="projectCard" ">
                        <figure id="projectImg">
                            <img src="${logoURL}" alt="project.name">
                        </figure>
                        <div id="projectDetailDiv">
                            <h3 id="projectName">${project.name}</h3>
                            <p id="shortDesc">${project.outline}</p>
                            <p id="date">${project.date}</p>
                        </div>
                    </li>
                </a>
                <button id="editBtn" style="display: ${(isOwnProfile) ? 'block' : 'none'}" onclick="toEditProject(${project.id})">Edit</button>
            </div>`
    });



}

function toEditProject (projectId) {
    sessionStorage.setItem('modifying-project', 'true');
    location.href = `../html/projectUpload.html?id=${projectId}`
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
        const route = (isOwnProfile) ? '/project/personal' : '/project';
        const response = await fetch(url + route, fetchOptions);
        const projects = await response.json();
        console.log(projects);
        const userProjects = projects.filter(author);
        projectList = userProjects;
        console.log('userProjects', userProjects);
        createProjectCard(userProjects);
    } catch (e) {
        console.log(e.message);
    }
};


if (isOwnProfile) {
    updateUserInfo(currentUser);
    displayPersonalProjects()
} else {
    displayUserInfo().then(() => {
        displayPersonalProjects();
    });
}

function filterBtn() {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
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
            console.log('newest');
            break;
        case 'oldest':
            createProjectCard(listClone.reverse());
            break;
        case 'aZ':
            listClone.sort(function (a,b){
                if(a.name.toUpperCase() < b.name.toUpperCase()) {return -1; }
                if (a.name.toUpperCase() > b.name.toUpperCase()) {return  1;}
                return 0;
            })
            console.log('alpha', listClone);
            createProjectCard(listClone);
            break;
        case 'zA':
            listClone.sort(function (a,b){
                if (a.name.toUpperCase() > b.name.toUpperCase()) {return 1; }
                if (a.name.toUpperCase() < b.name.toUpperCase()) {return -1; }
                return 0;
            })
            console.log('reverse', listClone);
            createProjectCard(listClone.reverse());
            break;
    }
}