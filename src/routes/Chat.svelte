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
    chat.enterRoom("-Mdo2Z4WDYL1dwXt8TAr")
    getAllRooms()
}
let roomId="-MdnCEu_eY9oQ5sqAsD3";
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


let messages="";

let enterMessages = (id) =>{
db.ref('chat/room-messages/'+id).on('value', (snapshot) => {
const data = snapshot.val();
messages=Object.values(data);
console.log(messages[0]);
});
}

let rooms={}
const getAllUsers =() =>{
db.ref('chat/room-messages/'+id).on('value', (snapshot) => {
const data = snapshot.val();
messages=Object.values(data);
console.log(messages[0]);
});
}

const getAllRooms =() =>{
    chat.getRoomList((v)=>{
    rooms = Object.values(v)
    rooms[0].createdByUserId
    
});
        
   
}

const formatTimestampToDate = (t) => {
    const a = new Date(t);

    return  "Date: "+a.getDate()+"/"+(a.getMonth()+1)+ "/"+a.getFullYear()+" "+a.getHours()+":"+a.getMinutes()+":"+a.getSeconds();
 }

</script>



<style>
    .container{
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
    }
    .rooms{
        width: 20%;
        height: 100%;
        background-color: aquamarine;
        display: flex;
        flex-direction: column;
    }
    .messages{
        width: 80%;
        height: 100%;
        background-color: rgb(236, 226, 139);
        display: flex;
        flex-direction: column;
    }
    .singleMsg{
        width: 100%;
        height: max-content;
        padding: 15px 10px;
        background-color: rgb(255, 115, 0);
        margin: 10px 0;
    }
    .buttons{
        position: absolute;
        bottom: 0;
    }
    .singleUser{
        width: 100%;
        background-color: rgb(255, 131, 127);
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin: 10px 0;
    }
</style>


{#if allowed}

<div class="container">
    <div class="buttons">
        <button on:click='{logout}'>Logout</button>
<button on:click='{()=>createNewRoom($user.displayName,"private")}'>Create new room</button>
<button on:click='{()=>enterRoom(roomId)}'>Enter Room</button>
<input type="text" bind:value={roomId} >


<input type="text" bind:value ={message}>
<button on:click="{()=>sendMessage(roomId,message)}">send Message</button>



<button on:click='{()=>getRoom(roomId)}'>get Room</button>
<button on:click='{()=>enterMessages(roomId)}'>Enter Messages</button>
    </div>
    <div class="rooms">
        {#if Object.keys(rooms).length!=0}
        {#each rooms as room}
           <div class="singleUser">{room.name}</div> 
        {/each}
        {/if}
    </div>
    <div class="messages">
        {#each messages as msg}
        <div class="singleMsg">
            {msg.message} : {msg.name} at {formatTimestampToDate(msg.timestamp)} <br>
        </div>
        
        {/each}
        
    </div>
</div>


{/if}