import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCTneqQkfJNqL6gHna9TLXSIdRr81BR7To",
    authDomain: "chat-application-4d40e.firebaseapp.com",
    databaseURL: "https://chat-application-4d40e.firebaseio.com",
    projectId: "chat-application-4d40e",
    storageBucket: "",
    messagingSenderId: "1000881256400"
};
firebase.initializeApp(config);

export default firebase;