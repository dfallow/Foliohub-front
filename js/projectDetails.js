const url = 'http://10.114.32.29/foliohub';

let currentUrl = window.location.href;
const projectId = currentUrl.split('=').pop();

//selecting html elements
const projectDetails = document.querySelector('.projectDetails');

const appOverview = document.querySelector('#appOverview');
const appOverviewTop = document.querySelector('#appOverviewTop');
const appOverviewBottom = document.querySelector('#appOverviewBottom');

const media = document.querySelector('#media');
const comments = document.querySelector('#comments');
const moreInfo = document.querySelector('#moreInfo');

const createProjectDetails = (project) => {

    //clear project details
    projectDetails.innerHTML = '';

    //App logo in appOverview
    const logo = document.createElement('img');
    if (project.images) {
        logo.src = url + '/' + project.images;
        logo.alt = project.name;
    } else{
        logo.src = "../images/logo.png";
        logo.all = "No image found";
    }
    const figure = document.createElement('figure').appendChild(logo);

    const appName = document.createElement('h3');
    appName.innerHTML = project.name;

    const author = document.createElement('h4');
    author.innerHTML = "Author";

    const tags = document.createElement('ul');
    // TODO tags need to be implemneted first
    tags.innerHTML = '';

    const votes = document.createElement('ul')
    votes.id = "votes"

    //const upVote = document.createElement()

    const descriptionShort = document.createElement('p');
    descriptionShort.innerHTML = project.description;

    const downloadBtn = document.createElement('button')

    appOverviewTop.appendChild(figure);
    appOverviewTop.appendChild(appName);
    appOverviewTop.appendChild(author);
    appOverviewTop.appendChild(tags);
    appOverviewTop.appendChild(votes);
    appOverviewTop.appendChild(descriptionShort);
    appOverviewTop.appendChild(downloadBtn);

    appOverview.appendChild(appOverviewTop);
    projectDetails.appendChild(appOverview);




}

//AJAX call
const getProject = async () => {
    try {
        const response = await fetch(url + '/project/' + projectId);
        const project = await response.json();
        console.log(project)
        //const authorResponse = await fetch(url + '/user/' + project.author);
        //const authorId = await authorResponse.json();
        //console.log(authorId);
        createProjectDetails(project);
    } catch (e) {
        console.log(e.message);
    }
};
getProject();