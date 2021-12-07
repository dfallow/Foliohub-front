'use strict';
const url = window.GLOBAL_URL; //should be server address

//selecting html element
const ul = document.querySelector('#projectList');
const profilePic = document.querySelector('#profilePic');
const loadMore = document.querySelector('#load-more');
const drawer = document.querySelector('#side-menu');
let projectsExample;

//creating list of projects
const createProjectList = (projects) => {
    //clear ul element
    for (let i = 0; i < 3; i++) {
        projects.forEach((project) => {
            //creating li element with DOM methods

            const src = (project.images) ? url + '/' + project.images : '';
            const alt = (project.images) ? project.name : 'no picture';
            const href = `../html/projectDetails.html?id=${project.id}`

            ul.innerHTML +=
                `<a href="${href}">
                    <li class="project-card">
                        <figure class="project-card-fig">
                            <img src="${src}" alt="${alt}">
                        </figure>
                        <h3 class="project-card-title">${project.name}</h3>
                    </li>
                </a>`

            // let figure;
            // const img = document.createElement('img');
            // console.log(project.images);
            // if (project.images) {
            //     img.src = url + '/' + project.images;
            //     img.alt = project.name;
            //
            // }
            // img.className = "project-card-image"
            //
            // figure = document.createElement('figure').appendChild(img);
            // figure.className = 'project-card-fig';
            //
            // const h3 = document.createElement('h3');
            // h3.className = 'project-card-title'
            // h3.innerHTML = project.name;
            //
            // //view button
            // //const viewBtn = document.createElement('a');
            // //viewBtn.id = "viewBtn";
            // //viewBtn.innerHTML = 'View';
            // //viewBtn.href = `../html/projectDetails.html?id=${project.id}`
            // //viewBtn.classList.add('button');
            //
            // const a = document.createElement('a');
            // a.href = `../html/projectDetails.html?id=${project.id}`;
            //
            // const li = document.createElement('li');
            // li.id = "projectCard"
            //
            // li.appendChild(figure);
            // li.appendChild(h3);
            // //li.appendChild(viewBtn);
            // a.appendChild(li);
            // ul.appendChild(a);
        });
    }
};

function openDrawer() {
    drawer.style.visibility = 'visible';
    drawer.style.width = '70vw';
}

function closeDrawer() {
    drawer.style.visibility = 'hidden';
    drawer.style.width = '0';

}

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

profilePic.addEventListener('click', (evt) => {
    evt.preventDefault();
    location.href = 'myProfile.html';
})

loadMore.addEventListener('click', (evt => {
    evt.preventDefault();
    createProjectList(projectsExample);
}))


