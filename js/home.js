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

let projects;

//AJAX call
const getProjects = async () => {
    try {
        const response = await fetch(url + '/project');
        projects = await response.json();
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

function filter(filterChoice) {
    ul.innerHTML = '';
    let listClone = [...projects];
    switch (filterChoice) {
        case 'newest':
            createProjectList(projects);
            break;
        case 'oldest':
            createProjectList(listClone.reverse());
            break;
        case 'aZ':
            listClone.sort(function (a,b){
                if(a.name.toUpperCase() < b.name.toUpperCase()) {return -1; }
                if (a.name.toUpperCase() > b.name.toUpperCase()) {return  1;}
                return 0;
            })
            createProjectList(listClone);
            break;
        case 'zA':
            listClone.sort(function (a,b){
                if (a.name.toUpperCase() > b.name.toUpperCase()) {return 1; }
                if (a.name.toUpperCase() < b.name.toUpperCase()) {return -1; }
                return 0;
            })
            createProjectList(listClone.reverse());
            break;
    }
}

function searchBarFilter(string) {

}


