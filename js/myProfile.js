'use strict';
const url = window.GLOBAL_URL;

const div = document.querySelector('.personal');

const currentUser = JSON.parse(sessionStorage.getItem('user'));

const createProjectCard = (projects) => {
    projects.forEach((project) => {
        div.innerHTML += project.id;
    })
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
        createProjectCard(projects);
    } catch (e) {
        console.log(e.message);
    }
};
displayPersonalProjects();