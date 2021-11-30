'use strict';
const url = 'http://10.114.32.29/foliohub';

const div = document.querySelector('#personal');

const currentUser = JSON.parse(sessionStorage.getItem('user'));

const displayPersonalProjects = async (user) => {

    try {
        const fetchOptions = {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                user: user,
            },
        };
        const response = await fetch(url + '/projects/personal', fetchOptions);
        const projects = await response.json();
        div.innerHTML = projects;
    } catch (e) {
        console.log(e.message);
    }
};

displayPersonalProjects(currentUser);