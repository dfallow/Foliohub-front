/*
* Name: constants.js
* Description: Setting the url required for working locally or on the virtual server.
*/

const LOCAL_TESTING = true; //switch this one to false if working on the virtual server

window.GLOBAL_URL = (LOCAL_TESTING)
    ? 'http://localhost:3001'
    : "http://10.114.32.29/foliohub"
