import { writable } from "svelte/store";

  
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:  "AIzaSyCVnxQyWaHM-j5aS-vDT_0jZBMkzGANkqY",
  authDomain: "messengerclone-6917b.firebaseapp.com",
  projectId: "messengerclone-6917b",
  storageBucket: "messengerclone-6917b.appspot.com",
  messagingSenderId: "68690212986",
  appId:  "1:68690212986:web:bf0f2e282a707f96faa3c3",
  databaseURL:"https://messengerclone-6917b-default-rtdb.europe-west1.firebasedatabase.app/"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.database();
export const user = writable(0)
auth.onAuthStateChanged(async function(kuser) {
    if (kuser) {

        console.log(kuser)
        user.set(kuser)
    } else {
        // No user is signed in.
        console.log('no user')
        user.set(undefined)
    }
});