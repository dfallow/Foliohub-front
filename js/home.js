'use strict';
const url = 'http://10.114.32.29/foliohub'; //should be server address

//selecting html element
const ul = document.querySelector('#projectList');
const profilePic = document.querySelector('#profilePic');

//creating list of projects
const createProjectList = (projects) => {
    //clear ul element
    ul.innerHTML = '';

    projects.forEach((project) => {
        //creating li element with DOM methods
        //const img = document.createElement('img');
        //img.src = url + '/' + project.filename;
        //img.alt = project.name;

        //const figure = document.createElement('figure').appendChild(img);

        const h3 = document.createElement('h3');
        h3.innerHTML = project.name;

        //view button
        const viewBtn = document.createElement('a');
        viewBtn.innerHTML = 'View';
        viewBtn.href = `../html/projectDetails.html?id=${project.id}`
        viewBtn.classList.add('button');

        const li = document.createElement('li');

        //li.appendChild(figure);
        li.appendChild(h3);
        li.appendChild(viewBtn);
        ul.appendChild(li);
    });
};

//AJAX call
const getProject = async () => {
    try {
        const response = await fetch(url + '/project');
        const projects = await response.json();
        console.log(projects)
        createProjectList(projects);
    } catch (e) {
        console.log(e.message);
    }
};
getProject();

profilePic.addEventListener('click', () => {
    location.href = 'accountCreate.html';
})


