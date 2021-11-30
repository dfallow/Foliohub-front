'use strict';
const url = 'http://10.114.32.29/foliohub';

const div = document.querySelector('.personal');

const currentUser = JSON.parse(sessionStorage.getItem('user'));

const displayPersonalProjects = async () => {

    try {
        const fetchOptions = {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/project/personal', fetchOptions);
        const projects = await response.json();
        div.innerHTML = projects;
    } catch (e) {
        console.log(e.message);
    }
};

displayPersonalProjects();