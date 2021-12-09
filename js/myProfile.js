'use strict';
const url = window.GLOBAL_URL;
console.log(url);

const userImg = document.getElementById("userImg");
const div = document.querySelector('.personal');
const username = document.querySelector('#userName');
const developerType = document.querySelector('#developerType');
const memberSince = document.querySelector('#memberSince');
const userDesc = document.querySelector('#userDesc');


const currentUser = JSON.parse(sessionStorage.getItem('user'));
console.log('Current user: ', currentUser);

// const userId = currentUser.userId;
console.log(currentUser.profilePic);
if (currentUser.profilePic) {
    userImg.src = url + '/uploads/user/' + currentUser.profilePic;
    userImg.alt = "user profile pic";
}
username.innerHTML = currentUser.username;
developerType.innerHTML = currentUser.title;
memberSince.innerHTML = currentUser.creationDate;
userDesc.innerHTML = currentUser.description;




const userProjects = document.querySelector('#userProjects');

const createProjectCard = (projects) => {
    //clear user projects
    userProjects.innerHTML = '';

    //const orderedProjects = projects.

    projects.forEach((project) => {
        const logoURL = url + '/uploads/project/' + project.logo;

        userProjects.innerHTML +=
            `<div id="project-card-container">
                <a id="card-link" href="../html/projectDetails.html?id=${project.id}">
                    <li id="projectCard">
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
                <button id="editBtn" onclick="toEditProject(${project.id})">Edit</button>
            </div>`
    });
}

function toEditProject (projectId) {
    sessionStorage.setItem('modifying-project', 'true');
    location.href = `../html/projectUpload.html?id=${projectId}`
}

function author(project) {
    if (project.author === currentUser.userId) {
        return project
    }
}

const displayPersonalProjects = async () => {
    try {
        const fetchOptions = {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/project/personal', fetchOptions);
        const projects = await response.json();
        const userProjects = projects.filter(author);
        console.log('userProjects', userProjects);
        createProjectCard(userProjects);
    } catch (e) {
        console.log(e.message);
    }
};
displayPersonalProjects();
// getUserInfo(userId);
