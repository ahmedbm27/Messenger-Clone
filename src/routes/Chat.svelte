<script>
import {user,db} from "../firebase.js"
import { navigate } from "svelte-routing";
import {onMount,onDestroy} from "svelte"


let unsubscribeUser = () => {};
let allowed = false;
onMount( async () => {
     unsubscribeUser = await user.subscribe( (v) => {
        if (v == undefined) {
            navigate("/")
        } else if (v == 0) {
            
        } else {
            allowed = true
            initFirechat($user);
        }
    })
})
onDestroy(() => {
    unsubscribeUser()
})
const logout = () =>{
    firebase.auth().signOut().then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});
}


let chat;
let initFirechat =  (user) =>{
    // Get a Firebase Database ref
    let FirechatRef = db.ref("chat");

    // Create a Firechat instance
     chat = new Firechat(FirechatRef);
    // Set the Firechat user
    chat.setUser(user.uid, user.displayName);    
}
let roomId;
let message;
let createNewRoom = (name,type) =>{
    chat.createRoom(name, type, (v) =>{
        roomId=v
        console.log('Room created with id ' +id);
    })
}
let enterRoom = (id) =>{
    chat.enterRoom(id)
    console.log('Room Entered with id ' +id);
}
let leaveRoom = (id) =>{
    chat.leaveRoom(id)
    console.log('Leaving Room ' +id);
}

let sendMessage = (id,message) =>{
    chat.sendMessage(id, message,'default', ()=>{
        console.log("mesage sent");
    })
}

let getRoom  = (id) =>{
    chat.getRoom(id, (v)=>{
        console.log(v);
    })
}
/* Firechat.getRoomList((rooms)=>{
        console.log(rooms);
    });  */


    

  

</script>


<div id="firechat-wrapper"></div>
{#if allowed}
<button on:click='{logout}'>Logout</button>
<button on:click='{()=>createNewRoom("MyRoom","private")}'>Create new room</button>
<button on:click='{()=>enterRoom(roomId)}'>Enter Room</button>
<input type="text" bind:value={roomId}>


<input type="text" bind:value ={message}>
<button on:click="{()=>sendMessage(roomId,message)}">send Message</button>



<button on:click='{()=>getRoom(roomId)}'>get Room</button>
{/if}