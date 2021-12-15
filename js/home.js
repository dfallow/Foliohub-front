'use strict';
const url = window.GLOBAL_URL; //should be server address

//selecting html element
const ul = document.querySelector('#projectList');
const loadMore = document.querySelector('#load-more');

const searchBar = document.querySelector('.searching');

let projectsExample;

//creating list of projects
const createProjectList = (projects) => {
    //clear ul element
    ul.innerHTML = '';
    projects.forEach((project) => {
        //creating li element with DOM methods

        const src = (project.logo) ? url + '/uploads/project/' + project.logo : '../images/logo.png';
        const alt = (project.logo) ? project.name : 'no picture';
        const href = `../html/projectDetails.html?id=${project.id}`
        const thumbUpDown = (project.rating < 0) ? -1 : 1;


        ul.innerHTML +=
            `<a href="${href}">
                    <li class="project-card">
                        <figure class="project-card-fig">
                            <img id="appLogo" src="${src}" alt="${alt}">
                        </figure>
                        <div id="card-bottom">
                            <h3 class="project-card-title">${project.name}</h3>
                            <div id="project-stats">
                                <div id="comment-count">
                                    <img src="../images/comment.png" alt="">
                                    <p>${project.comments}</p>
                                </div>
                                <div id="rating">
                                    <img src="../images/like.png" alt="" style="transform: scaleY(${thumbUpDown})">
                                    <p>${project.rating}</p>      
                                </div>
                            </div>
                        </div>
                        
                    </li>
                </a>`
    });
};

let projects;

//AJAX call
const getProjects = async () => {
    try {
        console.log(url + '/project');
        const response = await fetch(url + '/project');
        projects = await response.json();
        console.log(projects)
        projectsExample = projects;
        createProjectList(projects);
        if (sessionStorage.getItem('projectDetailsVisited')) {
            const response2 = await fetch(url + '/project');
            projects = await response2.json();
            createProjectList(projects);
        }
    } catch (e) {
        console.log(e.message);
    }
};

// loadMore.addEventListener('click', (evt => {
//     evt.preventDefault();
//     createProjectList(projectsExample);
// }))

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
        case 'rating':
            listClone.sort(function (a,b){
                if (a.rating > b.rating) {return 1; }
                if (a.rating < b.rating) {return -1; }
                return 0;
            })
            createProjectList(listClone.reverse());
            break;
        case 'comments':
            listClone.sort(function (a,b){
                if (a.comments > b.comments) {return 1; }
                if (a.comments < b.comments) {return -1; }
                return 0;
            })
            createProjectList(listClone.reverse());
            break;

    }
}

searchBar.addEventListener('input', (evt) => {
    setTimeout(() => {
        searchBarFilter(searchBar.value);
    }, 500)
})

function searchBarFilter(string) {
    ul.innerHTML = '';
    let listClone = [...projects];
    if (string.length === 0) {
        createProjectList(projects)
    } else {
        const filtered = listClone.filter(project => project.name.toLowerCase().includes(string.toLowerCase()));
        if (filtered.length === 0) {
            ul.style.display = 'flex';
            ul.style.flexDirection = 'column';
            ul.style.alignItems = 'center';
            ul.innerHTML = `
                <p style="font-size: 100px; margin: 0">👻</p>
                <p id="not-found" style="color: rgba(255,255,255,0.7); font-size: 30px">No result found for '${string}'</p>
            `
        } else {
            ul.style.display = 'grid';
            ul.style.flexDirection = 'row';
            createProjectList(filtered);
        }
    }
}

window.onpageshow = () => {
    getProjects();
}