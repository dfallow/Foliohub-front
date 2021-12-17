/*
* Name: home.js
* Description: Script handling all the functionalities on the home page:
* creating a list of project cards and handling search and filter
*/

'use strict';
const url = window.GLOBAL_URL;

const ul = document.querySelector('#projectList');
const searchBar = document.querySelector('.searching');

//creating list of project cards
const createProjectList = (projects) => {
    //clear ul element
    ul.innerHTML = '';
    projects.forEach((project) => {
        //creating cards with thumbnails instead of original pictures, name of the project and stats (rating and comments)
        const src = (project.logo) ? url + '/thumbnails/project/' + project.logo : '../images/logo.png';
        const alt = (project.logo) ? project.name : 'no picture';
        const href = `../html/projectDetails.html?id=${project.id}`
        // if the rating is negative, the thumb will be pointing downwards
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

// getting all public projects and displaying them as cards
const getProjects = async () => {
    try {
        console.log(url + '/project');
        const response = await fetch(url + '/project');
        projects = await response.json();
        console.log(projects)
        createProjectList(projects);
        // this makes the app fetch the info again in case someone gives a rating or comments
        // and returns to the home page by pressing the back button.
        // for some reason, the stats will not refresh otherwise
        if (sessionStorage.getItem('projectDetailsVisited')) {
            const response2 = await fetch(url + '/project');
            projects = await response2.json();
            createProjectList(projects);
        }
    } catch (e) {
        console.log(e.message);
    }
};

// sorting projects according to creation date, name, number of comments or rating
function sort(filterChoice) {
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

// handling searchbar which filters apps by name and descending date of creation
searchBar.addEventListener('input', (evt) => {
    setTimeout(() => {
        searchBarFilter(searchBar.value);
    }, 500)
})
function searchBarFilter(string) {
    ul.innerHTML = '';
    let listClone = [...projects];
    if (string.length === 0) {
        ul.style.display = 'grid';
        ul.style.flexDirection = 'row';
        createProjectList(projects);
    } else {
        // showing a message when no result is found for the string input
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