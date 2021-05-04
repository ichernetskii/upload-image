import "../style/style.scss";
import {upload} from "./upload.js";

// Firebase
// import firebase from "firebase/app";
// import "firebase/storage";

// Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyC19Lrj9hAWjXSifm8tFJItJ3b2BwRl5Ac",
//     authDomain: "upload-image-js.firebaseapp.com",
//     projectId: "upload-image-js",
//     storageBucket: "upload-image-js.appspot.com",
//     messagingSenderId: "555352998198",
//     appId: "1:555352998198:web:e97981c63471f197c67397"
// };
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const storage = firebase.storage();

upload(".upload-image", {
    multi: true,
    accept: [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp"],
    onUpload: (files, blocks) => {
        files.forEach((file, index) => {
            // const ref = storage.ref(`images/${file.name}`);
            // const task = ref.put(file);
            // task.on("state_changed", snapshot => {
            //     const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + "%";
            //     const block = blocks[index].querySelector(".preview__progress");
            //     block.textContent = percentage;
            //     block.style.width = percentage;
            // }, error => {
            //     console.log("Error");
            // }, () => {
            //     task.snapshot.ref.getDownloadURL()
            //         .then(url => console.log(`Download URL: `, url));
            // })
        });
    }
});
