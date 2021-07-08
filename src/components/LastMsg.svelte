<script>
export let RoomSmsg;
export let items;
import {LastMsgsTracker} from "../store.js"
import {user} from "../firebase.js"






let lastMsg
let status = false
let uid;


let checkTracker = (LastMsgsTracker,lastMsg,msgs)=>{
    LastMsgsTracker.map((value,index)=>{
        if (value.RoomId == items ){
            if(value.lastMsg !== lastMsg){
                let x = {
                    "RoomId":msgs.id,
                    "lastMsg":lastMsg,
                    "status":false// msg vued or not
                }
                LastMsgsTracker[index] = [x]
                return false
            }else{
                if(value.status){
                    return true
                }else{
                    return false
                }
            }
        }else{
            let x = {
                    "RoomId":msgs.id,
                    "lastMsg":lastMsg,
                    "status":false// msg vued or not
                }
                LastMsgsTracker = [...LastMsgsTracker,x]
                return false
        }
    })
}



RoomSmsg.map( msgs =>{
    
if (msgs.id == items){
    
    let myRoom = msgs.RoomMsg.sort((x, y) =>{
        return x.timestamp - y.timestamp;
        })
    lastMsg = myRoom[msgs.RoomMsg.length - 1].message
    uid = myRoom[msgs.RoomMsg.length - 1].userId
    status = checkTracker($LastMsgsTracker,lastMsg,msgs)
    
}
})




</script>


<style>
    .lastMsg{
        font-size: 13px;
        color:#65676b;
        width: 200px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow-y: hidden;
        overflow-x: hidden;
}
    
    .lastMsg.bold{
        font-weight: bold;
        color:black;
    }
</style>

{#if uid===$user.uid}
<div class="lastMsg" id="lastMsg">                 
    {
    lastMsg
    }     
    </div>
{:else}
<div class="lastMsg {status ? "":"bold"}"id="lastMsg">                 
    {
    lastMsg
    }     
    </div>
{/if}
