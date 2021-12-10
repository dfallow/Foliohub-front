const LOCAL_TESTING = false; //switch this one to false if working on the virtual server

window.GLOBAL_URL = (LOCAL_TESTING)
    ? 'http://localhost:3001'
    : "http://10.114.32.29/foliohub"
