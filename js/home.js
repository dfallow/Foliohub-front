'use strict';
const url = window.GLOBAL_URL; //should be server address

//selecting html element
const ul = document.querySelector('#projectList');
const loadMore = document.querySelector('#load-more');


let projectsExample;



//creating list of projects
const createProjectList = (projects) => {
    //clear ul element
    projects.forEach((project) => {
        //creating li element with DOM methods

        const src = (project.logo) ? url + '/uploads/project/' + project.logo : '../images/logo.png';
        const alt = (project.logo) ? project.name : 'no picture';
        const href = `../html/projectDetails.html?id=${project.id}`

        ul.innerHTML +=
            `<a href="${href}">
                    <li class="project-card">
                        <figure class="project-card-fig">
                            <img id="appLogo" src="${src}" alt="${alt}">
                        </figure>
                        <h3 class="project-card-title">${project.name}</h3>
                    </li>
                </a>`
    });
};

//AJAX call
const getProjects = async () => {
    try {
        const response = await fetch(url + '/project');
        const projects = await response.json();
        console.log(projects)
        projectsExample = projects;
        createProjectList(projects);
    } catch (e) {
        console.log(e.message);
    }
};
getProjects();



loadMore.addEventListener('click', (evt => {
    evt.preventDefault();
    createProjectList(projectsExample);
}))


