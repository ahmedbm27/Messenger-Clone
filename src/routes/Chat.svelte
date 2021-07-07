<script>
import {user,db} from "../firebase.js"
import { navigate } from "svelte-routing";
import {onMount,onDestroy} from "svelte"



let userClickedUid;
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
let message;
let roomId="";

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

let RoomSmsg=[];// for all room(s) messages
//check if room ID exists in RoomSmsg
let checkRoomSmsg = (id) =>{
if(RoomSmsg.length !=0){
    let exist;
    for (let r of RoomSmsg){
        for (let o of Object.values(r)){
            let result = o.includes(id)
            if(result){
            exist = true;
            return exist
           }else{ 
               exist =false;
           }
        }
       
    }
   
    if (exist==false){
            return exist 
    }
}else{
    return false
}
}
let enterRoomMsgs = (id) =>{
    db.ref('chat/room-messages/'+id).on('value', (snapshot) => {
            const data = snapshot.val();
            let RoomMsg=Object.values(data);
            let exist = checkRoomSmsg(id)
            if(exist==false){
                RoomSmsg = [...RoomSmsg,{"id":id,RoomMsg}]
            }else if (exist==true){
               
                RoomSmsg.map((key,index) =>{
                    if (key.id === id){
                        RoomSmsg[index]= {"id":id,RoomMsg}
                    }
                })
            }
           
    }); 
}
let enterMessages = (id) =>{
if(RoomSmsg.length !=0){
    
    let exist = checkRoomSmsg(id)
    if (exist==false){
        enterRoomMsgs(id)
    } 
}else{
    enterRoomMsgs(id)
}


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
        m = false;
        o = false;
        if (!d){
            if(AllRooms[room].id.includes($user.uid)){
                m = true;
            }
            if(AllRooms[room].id.includes(oID)){
                o = true;  
            }
           
           
           if (m && o){
                singleRoom = room              
                d = true 
           }
         
        }
    }
      

    if (singleRoom ==false) {
        
        chat.createRoom("room", "private", (v) =>{
            roomId=v
            try {
                db.ref('chat/AllRooms/' +v).set({
                    "id":[$user.uid,oID]
                })
                chat.sendMessage(v, "",'default', ()=>{
                    enterMessages(roomId)
                })
               
            } catch (error) {
                
            }
           
        })
    }else{
        console.log("else");
        roomId =singleRoom
        enterMessages(roomId) 
        
        
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
        min-width: 360px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-right: 1px solid rgba(0,0,0,0.1);
    }
    .singleUser{
        width: 100%;
        color: black;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        border-radius: 5px;
        margin: 0 8px;
    }
    .singleUser:hover{
        background-color: #F5F5F5;

    }
    .singleUser .img{
        width: 56px;
        height: 56px;
        margin:8px 12px;
        position: relative;   
    }
    .singleUser img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .messagesNav img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .messagesNav .img{
        width: 40px;
        height: 40px;
        margin:8px 12px;
        position: relative;
    }
    .img .notif.online{
        width: 10px;
        height: 10px;
        background-color :#5AD539;
        position: absolute;
        bottom: 0;
        right: 0;
        border: 2px solid white;
        border-radius: 50%;
    }
    .singleUser .nameMsg{
        font-size: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: #050505;
    }
    .nameMsg .lastMsg{
        font-size: 13px;
        color:#65676b;
    }
    .messages{
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 75px;
    }
    .singleMsg .msgBlock{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .singleMsg .msgBlock .msg {
        height: max-content;
        padding: 8px 12px;
        background-color: #E4E6EB;
        margin: 10px 0;
        color: black;
        font-size: 15px;
        max-width: 564px;
        border-radius: 18px;
    }
    .singleMsg.myMsg .msgBlock .msg {
        background-color: #0099FF;
        color: white;
        margin-left: auto;
        margin-right: 22px;
    }
    .singleMsg .msgBlock .el {
        min-width: 80px;
        height: 10px;
       
    }
    .buttons{
        position: absolute;
        bottom: 0;
    }
    .singleMsg .img{
        width: 28px;
        height: 28px;
        margin:8px 12px;
        position: relative;   
    }
    .singleMsg img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
.roomsNav{
    display:flex;
    flex-direction: column;
    width: 100%;
    
}
.topPrt{
    display:flex;
    flex-direction:row;
    justify-content: space-between;
    margin:20px 16px 12px 16px;
}
.imgText{
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 24px;
    font-weight: 700;
}
.imgText .img{
        width: 36px;
        height: 36px;
        margin:0 12px 0 0;
        position: relative;   
    }
.imgText img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.buttonsContainer{
    display: flex;
}
.buttonsContainer .singleBtn{
   width: 36px;
   height: 36px;
   border-radius: 50%;
   background-color: #f5f5f5;
   margin-left: 12px;
   display: flex;
   justify-content: center;
   align-items: center;
}
.search{
    position: relative;
    padding: 0 16px;
    margin: 12px 0 20px 0;
}
.search input{
    background-color: #F3F3F5;
    width: 100%;
    border-radius: 50px ;
    height: 36px;
    border: none;
    font-size: 15px;
   
}
.search input::placeholder{
color :#666D76;
padding-left: 26px;
}
.search img{
    left: 26px;
    top: 10px;
    position: absolute;
    width: 16px;
    filter: invert(41%) sepia(6%) saturate(678%) hue-rotate(174deg) brightness(98%) contrast(84%);
}
.messagesContainer{
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column-reverse;
}
.messagesNav{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    padding-right: 12px;
    box-shadow: 0 0 4px rgba(0,0,0,0.2);
    position: absolute;
    background: white;
    z-index: 2;
    top: 0;
    width: 100%;
}
.userInfo{
    display: flex;
    align-items: center;
    font-size: 17px;
    font-weight: 600;
}

.messagesNav .rightBtns{
padding: 0 6px;
cursor: pointer;
}
.messagesSendingArea{
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    position: absolute;
    bottom: 0;
    z-index: 2;
    background: white;
}

.messagesSendingArea .textArea {
    display: flex;
    position: relative;
    width: 100%;
    
    
}
.messagesSendingArea textarea{
    width: 100%;
    height: 37px;
    background-color:#F3F3F5 ;
    border-radius: 50px;
    border: none;
    overflow: auto;
    outline: none;
    resize: none;
    font-size: 16px;
    padding-left: 15px;
    
}

.messagesSendingArea .textArea .emojies{
    position: absolute;
    right: 5px;
    top: 5px;
    height: 28px;
}
.messagesSendingArea .options{
    display: flex;
    height: 28px;
}
.messagesSendingArea .options svg{
    margin: 0 3px;
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
        display: flex;
        flex-direction: column;
    }
    .messages{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    } 
    }
</style>


{#if allowed}

<div class="container">
    <div class="buttons">
 
 
<button on:click='{logout}'>Logout</button>




<input type="text" bind:value ={message}>
<button on:click="{()=>sendMessage(roomId,message)}">send Message</button>

    </div>

    <div class="rooms">
        <div class="roomsNav">
            <div class="topPrt">
                <div class="imgText">
                    <div class="img"><img src="./imgs/user.jpg" alt=""></div>
                    <div class="text">Chats</div>
                </div>
               
                <div class="buttonsContainer">
                    <div class="singleBtn">
                        <svg viewBox="0 0 36 36" class="a8c37x1j ms05siws hwsy1cff b7h9ocf4" height="28" width="28"><path d="M12.5 18A2.25 2.25 0 118 18a2.25 2.25 0 014.5 0zm7.75 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm5.5 2.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"></path></svg>
                    </div>
                    <div class="singleBtn">
                        <svg viewBox="0 0 36 36" class="a8c37x1j ms05siws hwsy1cff b7h9ocf4" height="28" width="28"><path clip-rule="evenodd" d="M5 13.5a4 4 0 014-4h10a4 4 0 014 4v9a4 4 0 01-4 4H9a4 4 0 01-4-4v-9zm8 0a1 1 0 112 0v3.25c0 .138.112.25.25.25h3.25a1 1 0 110 2h-3.25a.25.25 0 00-.25.25v3.25a1 1 0 11-2 0v-3.25a.25.25 0 00-.25-.25H9.5a1 1 0 110-2h3.25a.25.25 0 00.25-.25V13.5z" fill-rule="evenodd"></path><path d="M29.552 23.393l-3.723-1.861A1.5 1.5 0 0125 20.19v-4.38a1.5 1.5 0 01.829-1.342l3.723-1.861A1 1 0 0131 13.5v9a1 1 0 01-1.448.894z"></path></svg>
                    </div>
                    <div class="singleBtn">
                        <svg viewBox="0 0 36 36" class="a8c37x1j ms05siws hwsy1cff b7h9ocf4" height="28" width="28"><path d="M17.305 16.57a1.998 1.998 0 00-.347.467l-1.546 2.87a.5.5 0 00.678.677l2.87-1.545c.171-.093.328-.21.466-.347l8.631-8.631a1.5 1.5 0 10-2.121-2.122l-8.631 8.632z"></path><path d="M18 10.5a1 1 0 001-1V9a1 1 0 00-1-1h-6a4 4 0 00-4 4v12a4 4 0 004 4h12a4 4 0 004-4v-6a1 1 0 00-1-1h-.5a1 1 0 00-1 1v6a1.5 1.5 0 01-1.5 1.5H12a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5h6z"></path></svg>
                    </div>
                </div>
            </div>
            <div  class="search">
                <img src="./imgs/search.svg" alt="">
                <input type="text" placeholder="Search Messenger">
            </div>
        </div>
        {#if Object.keys(onlineUsers).length!=0}
        {#each onlineUsers as onlineUser}
            {#if onlineUser.uid !== $user.uid}
            
            <div 
            on:click="{()=>{
                let x = onlineUser.uid ;
                getRoomMsgs(x)
                userClickedUid = x;
            }}"
            class="singleUser">
            <div class="img">
                <img src="./imgs/user.jpg" alt="user">
                
                <div class="notif {onlineUser.status ? "online" :""}" ></div>
                
            </div>
            
            <div class="nameMsg">
                <div class="name">{onlineUser.name}</div>
                <div class="lastMsg">i dont know</div>
            </div>
            </div> 
            {/if}
            
        {/each}
        {/if}
    </div>

    <div class="messagesContainer">
        <div class="messagesNav">
            {#if Object.keys(onlineUsers).length!=0}
            {#each onlineUsers as onlineUser}
            {#if onlineUser.uid == userClickedUid }
            <div class="userInfo">
                <div class="img">
                    <img src="./imgs/user.jpg" alt="user">
                    <div class="notif  {onlineUser.status ? "online" :""}" ></div>
                </div>
                <div class="name">{onlineUser.name}</div>
            </div>
            
            <div class="rightBtns">
                <svg role="presentation" fill="#0099FF" width="30px" height="30px" viewBox="0 0 36 36"><path d="M25.753 28.2c1.07-.357 1.816-1.275 2.423-2.225a2.05 2.05 0 00.037-2.151 4.998 4.998 0 00-.723-.963 11.594 11.594 0 00-2.888-2.112c-.58-.299-1.272-.212-1.808.159l-2.098 1.452a.472.472 0 01-.437.055 11.557 11.557 0 01-4.045-2.63 11.554 11.554 0 01-2.63-4.044.472.472 0 01.056-.437l1.453-2.098c.37-.536.457-1.228.158-1.807A11.587 11.587 0 0013.14 8.51a4.995 4.995 0 00-.963-.723 2.05 2.05 0 00-2.15.037c-.951.607-1.87 1.353-2.225 2.424-1.174 3.527 1.187 8.461 5.338 12.613 4.152 4.151 9.086 6.512 12.614 5.338z"></path></svg>
                <svg role="presentation" fill="#0099FF" width="34px" height="34px" viewBox="0 0 36 36"><path d="M9 9.5a4 4 0 00-4 4v9a4 4 0 004 4h10a4 4 0 004-4v-9a4 4 0 00-4-4H9zm16.829 12.032l3.723 1.861A1 1 0 0031 22.5v-9a1 1 0 00-1.448-.894l-3.723 1.861A1.5 1.5 0 0025 15.81v4.38a1.5 1.5 0 00.829 1.342z"></path></svg>
                <svg role="presentation" fill="#0099FF" width="28px" height="28px" viewBox="0 0 36 36"><path d="M12.5 18C12.5 19.2426 11.4926 20.25 10.25 20.25C9.00736 20.25 8 19.2426 8 18C8 16.7574 9.00736 15.75 10.25 15.75C11.4926 15.75 12.5 16.7574 12.5 18Z" fill="#0099FF"></path><path d="M20.25 18C20.25 19.2426 19.2426 20.25 18 20.25C16.7574 20.25 15.75 19.2426 15.75 18C15.75 16.7574 16.7574 15.75 18 15.75C19.2426 15.75 20.25 16.7574 20.25 18Z" fill="#0099FF"></path><path d="M25.75 20.25C26.9926 20.25 28 19.2426 28 18C28 16.7574 26.9926 15.75 25.75 15.75C24.5074 15.75 23.5 16.7574 23.5 18C23.5 19.2426 24.5074 20.25 25.75 20.25Z" fill="#0099FF"></path></svg>
            </div>
            {/if}
            {/each}
            {/if}
        </div>

        <div class="messages">
            {#each RoomSmsg as msgs}
            {#if msgs.id === roomId}
            {#each msgs.RoomMsg as msg}
            <div class="singleMsg {msg.userId === $user.uid ? "myMsg" :""}">
                
                <div class="msgBlock">
                    {#if msg.userId !== $user.uid }
                    <div class="img">
                        <img src="./imgs/user.jpg" alt="user">
                    </div>
                    {/if}
                    {#if msg.userId == $user.uid }
                    <div class="el"></div>
                    {/if}
                    <div class="msg">
                        {msg.message}
                    </div>
                   
                    
                </div>
                
                <!--: {msg.name} at {formatTimestampToDate(msg.timestamp)}-->
            </div>
            {/each}
            {/if}
            {/each}
            
        </div>

        <div class="messagesSendingArea">
            <div class="options">
                <svg viewBox="0 0 36 36" height="28px" width="28px" class="a8c37x1j muag1w35 dlv3wnog enqfppq2 rl04r1d5 ms05siws hr662l2t b7h9ocf4 crt8y2ji tftn3vyl"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 29c6.075 0 11-4.925 11-11S24.075 7 18 7 7 11.925 7 18s4.925 11 11 11zm-1-16a1 1 0 112 0v3.75c0 .138.112.25.25.25H23a1 1 0 110 2h-3.75a.25.25 0 00-.25.25V23a1 1 0 11-2 0v-3.75a.25.25 0 00-.25-.25H13a1 1 0 110-2h3.75a.25.25 0 00.25-.25V13z" fill="#0099FF"></path></svg>
                <svg viewBox="0 0 36 36" height="28px" width="28px" class="a8c37x1j muag1w35 dlv3wnog enqfppq2 rl04r1d5 ms05siws hr662l2t b7h9ocf4 crt8y2ji"><path d="M13.5 16.5a2 2 0 100-4 2 2 0 000 4z" fill="#0099FF"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7 12v12a4 4 0 004 4h14a4 4 0 004-4V12a4 4 0 00-4-4H11a4 4 0 00-4 4zm18-1.5H11A1.5 1.5 0 009.5 12v9.546a.25.25 0 00.375.217L15 18.803a6 6 0 016 0l5.125 2.96a.25.25 0 00.375-.217V12a1.5 1.5 0 00-1.5-1.5z" fill="#0099FF"></path></svg>
                <svg viewBox="0 0 36 36" height="28px" width="28px" class="a8c37x1j muag1w35 dlv3wnog enqfppq2 rl04r1d5 ms05siws hr662l2t b7h9ocf4 crt8y2ji"><path d="M8 12a4 4 0 014-4h12a4 4 0 014 4v5a1 1 0 01-1 1h-3a6 6 0 00-6 6v3a1 1 0 01-1 1h-5a4 4 0 01-4-4V12z" fill="#0099FF"></path><path d="M20 27c0 .89 1.077 1.33 1.707.7l5.993-5.993c.63-.63.19-1.707-.7-1.707h-3a4 4 0 00-4 4v3z" fill="#0099FF"></path></svg>
                <svg viewBox="0 0 36 36" height="28px" width="28px" class="a8c37x1j muag1w35 dlv3wnog enqfppq2 rl04r1d5 ms05siws hr662l2t b7h9ocf4 crt8y2ji"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 11a4 4 0 014-4h8c1.067 0 2.035.417 2.753 1.098.517.491 1.151.902 1.866.902H26a4 4 0 014 4v12a4 4 0 01-4 4h-8a3.986 3.986 0 01-2.752-1.098c-.518-.491-1.152-.902-1.866-.902H10a4 4 0 01-4-4V11zm7.865 4.908a1.948 1.948 0 00-1.321-.456c-.461.02-.918.214-1.295.576-.378.363-.65.873-.754 1.457a2.927 2.927 0 00.209 1.708c.236.52.611.915 1.046 1.14a1.87 1.87 0 001.36.152c.454-.122.88-.419 1.195-.868.098-.14.183-.291.253-.451.068-.154-.052-.316-.22-.316H12.85a.85.85 0 010-1.7h2.8c.47 0 .85.38.85.85a4.53 4.53 0 01-.803 2.593c-.527.75-1.277 1.3-2.144 1.534a3.57 3.57 0 01-2.586-.285c-.8-.414-1.43-1.107-1.811-1.947a4.628 4.628 0 01-.335-2.706 4.357 4.357 0 011.25-2.388 3.697 3.697 0 012.398-1.048 3.647 3.647 0 012.472.838.85.85 0 01-1.076 1.317zM22.7 19.6a.25.25 0 01.25-.25h2.75a.85.85 0 000-1.7h-2.75a.25.25 0 01-.25-.25v-1.45a.25.25 0 01.25-.25h3.2a.85.85 0 100-1.7h-4.3a.85.85 0 00-.85.85v6.3a.85.85 0 001.7 0V19.6zm-3.35-4.75a.85.85 0 00-1.7 0v6.3a.85.85 0 001.7 0v-6.3z" fill="#0099FF"></path></svg>
            </div>
            <div class="textArea">
                
                <textarea placeholder="Aa" ></textarea>
                             
                <div class="emojies">
                    <svg class="a8c37x1j muag1w35 dlv3wnog enqfppq2 rl04r1d5 ms05siws hr662l2t b7h9ocf4 crt8y2ji" height="28px" viewBox="0 0 36 36" width="28px"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 29c6.075 0 11-4.925 11-11S24.075 7 18 7 7 11.925 7 18s4.925 11 11 11zm-5.25-13c0-1.25.563-2 1.5-2 .938 0 1.5.75 1.5 2s-.563 2-1.5 2c-.938 0-1.5-.75-1.5-2zm7.5 0c0-1.25.563-2 1.5-2 .938 0 1.5.75 1.5 2s-.563 2-1.5 2c-.938 0-1.5-.75-1.5-2zm-7.52 5.464a1 1 0 011.41-.12 5.963 5.963 0 003.856 1.406c1.47 0 2.813-.528 3.856-1.406a1 1 0 111.288 1.53 7.962 7.962 0 01-5.144 1.876 7.962 7.962 0 01-5.144-1.877 1 1 0 01-.121-1.409z" fill="#0099FF"></path></svg>
                </div>
            </div>
            <div class="likeBtn">
                <svg viewBox="0 0 22 23" height="20" width="20" class="crt8y2ji"><path d="M10.987 0c1.104 0 3.67.726 3.67 5.149 0 1.232-.123 2.001-.209 2.534a16.11 16.11 0 00-.048.314l-.001.005a.36.36 0 00.362.406c4.399 0 6.748 1.164 6.748 2.353 0 .533-.2 1.02-.527 1.395a.11.11 0 00.023.163 2.13 2.13 0 01.992 1.79c0 .86-.477 1.598-1.215 1.943a.11.11 0 00-.046.157c.207.328.329.713.329 1.128 0 .946-.547 1.741-1.406 2.029a.109.109 0 00-.068.137c.061.184.098.38.098.584 0 1.056-1.776 1.913-5.95 1.913-3.05 0-5.154-.545-5.963-.936-.595-.288-1.276-.81-1.276-2.34v-6.086c0-1.72.958-2.87 1.911-4.014C9.357 7.49 10.3 6.36 10.3 4.681c0-1.34-.091-2.19-.159-2.817-.039-.368-.07-.66-.07-.928 0-.527.385-.934.917-.936zM3.5 11h-2C.5 11 0 13.686 0 17s.5 6 1.5 6h2a1 1 0 001-1V12a1 1 0 00-1-1z" fill="#0099FF"></path></svg>
            </div>
        </div>
    </div>
    
</div>


{/if}