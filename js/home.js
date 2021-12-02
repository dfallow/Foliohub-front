'use strict';
const url = 'http://10.114.32.29/foliohub'; //should be server address

//selecting html element
const ul = document.querySelector('#projectList');

//creating list of projects
const createProjectList = (projects) => {
    //clear ul element
    for (let i = 0; i < 20; i++) {
        if (i === 0) {
            ul.innerHTML = '';
        }
        projects.forEach((project) => {
            //creating li element with DOM methods
            let figure;
            const img = document.createElement('img');
            console.log(project.images);
            if (project.images) {
                img.src = url + '/' + project.images;
                img.alt = project.name;

            } else {
                img.src = "../images/logo.png"
                img.alt = "No image found"

            }
            figure = document.createElement('figure').appendChild(img);

            const h3 = document.createElement('h3');
            h3.innerHTML = project.name;

            //view button
            //const viewBtn = document.createElement('a');
            //viewBtn.id = "viewBtn";
            //viewBtn.innerHTML = 'View';
            //viewBtn.href = `../html/projectDetails.html?id=${project.id}`
            //viewBtn.classList.add('button');

            const a = document.createElement('a');
            a.href = `../html/projectDetails.html?id=${project.id}`;

            const li = document.createElement('li');
            li.id = "projectCard"

            li.appendChild(figure);
            li.appendChild(h3);
            //li.appendChild(viewBtn);
            a.appendChild(li);
            ul.appendChild(a);
        });
    }
};

//AJAX call
const getProjects = async () => {
    try {
        const response = await fetch(url + '/project');
        const projects = await response.json();
        console.log(projects)
        createProjectList(projects);
    } catch (e) {
        console.log(e.message);
    }
};
getProjects();
