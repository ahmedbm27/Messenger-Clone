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


let AllRooms=[];
let chat;
let initFirechat =  async (user) =>{
    // Get a Firebase Database ref
    let FirechatRef = db.ref("chat");

    // Create a Firechat instance
     chat = new Firechat(FirechatRef);
    // Set the Firechat user
    chat.setUser(user.uid, user.displayName); 
    await beOnline();
    getAllUsers()

     //get all rooms available
     let ref=db.ref('chat/AllRooms');
    await ref.on('value', (snapshot) => {
        const data = snapshot.val();
        AllRooms = data
        });

   
    
}
let roomId="";
let message;
let createNewRoom = (name,type) =>{
    chat.createRoom(name, type, (v) =>{
       roomId = v    
    })
}
let enterRoom = (id) =>{
    chat.enterRoom(id)
    console.log('Room Entered with id ' +id);
}

let sendMessage = (id,message) =>{
    chat.sendMessage(id, message,'default', ()=>{
        console.log("mesage sent");
    })
}

let messages="";
let enterMessages = (id) =>{
db.ref('chat/room-messages/'+id).on('value', (snapshot) => {
const data = snapshot.val();
messages=Object.values(data);
console.log(messages);
});
}


//get all online users
let onlineUsers={};
const getAllUsers =() =>{
db.ref('chat/online-state').on('value', (snapshot) => {
const data = snapshot.val();
onlineUsers=Object.values(data);
});
}

const beOnline = () =>{
    let ref=db.ref('chat/online-state/'+$user.uid);
    ref.set(
        {
            "uid" :$user.uid,
            "name":$user.displayName,
            "status":true
        })
    ref.onDisconnect().set({
            "uid" :$user.uid,
            "name":$user.displayName,
            "status":false
        });
}
const getRoomMsgs = async (oID) =>{
    
    let singleRoom=false;
    let m = false;
    let o = false;
    let d = false;
    for(let room in AllRooms){
        console.log(d);
        if (!d){
        console.log("dkhal");
            if(AllRooms[room].id.includes($user.uid)){
                console.log("m : " + $user.uid + " room " + AllRooms[room].id);
                m = true;
            }
            if(AllRooms[room].id.includes(oID)){
                console.log("m : " + oID + " room " + AllRooms[room].id);
                o = true;
            }
            /* if(obj[userID] === $user.uid){
                m = true;
            }
            if(obj[userID]===oID){
                o=true;
            } */
            console.log(m,o);
           
           if (m && o){
                console.log("fesfes");
                singleRoom = room              
                m = false;
                o = false;
                d = true
               
           }
         
        }
    }
      

    if (singleRoom ==false) {
        chat.createRoom("room", "private", (v) =>{
            try {
                db.ref('chat/AllRooms/' +v).set({
                    "id":[$user.uid,oID]
                })
                chat.sendMessage(v, "",'default', ()=>{
                    enterMessages(v)
                })
            } catch (error) {
                
            }
           
        })
    }else{
        console.log("asba");
        console.log(singleRoom);
        enterMessages(singleRoom) 
        roomId =singleRoom
        
    }
     
   

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
        color: white;
    }
    .singleMsg.myMsg{
        background-color: rgb(4, 0, 255);
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

    @media only screen and (max-width:800px){
    .container{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
    .rooms{
        width: 100%;
        height: 20%;
        background-color: aquamarine;
        display: flex;
        flex-direction: column;
    }
    .messages{
        width: 100%;
        height: 100%;
        background-color: rgb(236, 226, 139);
        display: flex;
        flex-direction: column;
    } 
    }
</style>


{#if allowed}

<div class="container">
    <div class="buttons">
 
 
<button on:click='{logout}'>Logout</button>

<!--<button on:click='{()=>createNewRoom($user.displayName,"private")}'>Create new room</button>
<button on:click='{()=>enterRoom(roomId)}'>Enter Room</button>
<input type="text" bind:value={roomId} >-->  


<input type="text" bind:value ={message}>
<button on:click="{()=>sendMessage(roomId,message)}">send Message</button>



<!--<button on:click='{()=>enterMessages(roomId)}'>Enter Messages</button>-->  
    </div>
    <div class="rooms">
        {#if Object.keys(onlineUsers).length!=0}
        {#each onlineUsers as onlineUser}
            {#if onlineUser.uid !== $user.uid}
            {#if onlineUser.status}
            <div 
            on:click="{()=>{let x = onlineUser.uid ;getRoomMsgs(x)}}"
            class="singleUser">{onlineUser.name}</div> 
            {/if}
            {/if}
        {/each}
        {/if}
    </div>
    <div class="messages">
        {#each messages as msg}
       
        <div class="singleMsg {msg.userId === $user.uid ? "myMsg" :""}">
            {msg.message} : {msg.name} at {formatTimestampToDate(msg.timestamp)} <br>
        </div>
        
        {/each}
        
    </div>
</div>


{/if}