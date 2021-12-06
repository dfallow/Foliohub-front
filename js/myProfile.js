'use strict';
const url = window.GLOBAL_URL;

const userImg = document.getElementById("userImg");
const div = document.querySelector('.personal');
const username = document.querySelector('#userName');
const developerType = document.querySelector('#developerType');
const memberSince = document.querySelector('#memberSince');
const userDesc = document.querySelector('#userDesc');

const currentUser = JSON.parse(sessionStorage.getItem('user'));
console.log('Current user: ', currentUser);

if (currentUser.profilePic) {
    userImg.src = currentUser.profilePic;
}
username.innerHTML = currentUser.username;
developerType.innerHTML = currentUser.title;
memberSince.innerHTML = currentUser.creationDate;
userDesc.innerHTML = currentUser.description;

const userProjects = document.querySelector('#userProjects');


const createProjectCard = (projects) => {
    //clear user projects
    userProjects.innerHTML = '';

    projects.forEach((project) => {
        let figure;
        const projectImg = document.createElement('img');
        if (project.images) {
            projectImg.src = url + '/' + project.images;
            projectImg.alt = project.name;

        } else {

            projectImg.src = "../images/logo.png"
            projectImg.alt = "No image found"

        }
        figure = document.createElement('figure').appendChild(projectImg);
        figure.id = "projectImg"

        const name = document.createElement('h3');
        name.id = "projectName";
        name.innerHTML = project.name;

        const shortDesc = document.createElement('p')
        shortDesc.id = "shortDesc"
        shortDesc.innerHTML = project.description;

        const date = document.createElement('p')
        date.id = "date"
        date.innerHTML = project.date;

        const a = document.createElement('a');
        a.href = `../html/projectDetails.html?id=${project.id}`;

        const li = document.createElement('li');
        li.id = "projectCard"

        const projectDetailDiv = document.createElement('div');projectDetailDiv.id = "projectDetailDiv"

        projectDetailDiv.appendChild(name);
        projectDetailDiv.appendChild(shortDesc);
        projectDetailDiv.appendChild(date);
        li.appendChild(figure);
        li.appendChild(projectDetailDiv);
        a.appendChild(li);
        userProjects.appendChild(a);


    });
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
