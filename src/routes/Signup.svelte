<script>
import {auth, user} from '../firebase.js'
import {onMount, onDestroy} from 'svelte'
import { navigate } from "svelte-routing";

let errorMessage = undefined
const form = {}
let unsubscribeUser = () => {} ;
let allowed = false;
onMount(() => {
    unsubscribeUser = user.subscribe((v) => {
        if (v == undefined) {
            allowed = true
        } else if (v == 0) {
        } else {
            navigate("/")
        }
    })
})


onDestroy(() => {
    unsubscribeUser()
})
const doSubmit = async () => {
    
           
      
        errorMessage = undefined
        let lform = Object.fromEntries(Object.entries(form).map(([key, el]) => [key, el.value]))
        if (lform.repassword != lform.password) {
            errorMessage = "Passwords do not match"
            return
        }
        
        await auth.createUserWithEmailAndPassword(lform.email, lform.password)
        .then(async (result) => {
            await result.user.updateProfile({
                displayName: lform.name
            })

            await auth.signOut().then(() => {
            navigate("/")
            }).catch((error) => {
            // An error happened.
            });

        })
        .catch((error) => {
            errorMessage = error.message 
        })
      
    };

</script>

<style>
.container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.container img{
    padding: 45px 0;
    height: 75px;
    width: 75px;
}
.container .title{
    color: rgba(0, 0, 0, 1);
    font-size: 40px;
    font-weight: 300;
    margin-bottom: 24px;
    text-align: center;
}
.inputContainer{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.inputContainer input{
    background: rgba(0, 0, 0, .04);
    border: none;
    border-radius: 10px;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 1);
    display: block;
    font-family: Calibre, Helvetica Neue, Segoe UI, Helvetica, Arial, Lucida Grande, sans-serif;
    font-size: 19px;
    height: 36px;
    margin-bottom: 12px;
    padding: 8px 16px;
    width: 320px;
    
}
.inputContainer input:focus{
    border: 1px solid #0084ff;
    border-radius: 10px;
    outline: none;

}
.inputContainer input::placeholder {
    color:#939393;
}
.inputContainer input::-webkit-input-placeholder {
    color:#939393;
}
.inputContainer input::-webkit-input-placeholder {
    color:#939393;
}
.inputContainer input::-ms-input-placeholder {
    color:#939393;
}
.inputContainer input:focus::placeholder {
    color:#BEC3C9;
}
.inputContainer input:focus::-webkit-input-placeholder {
    color:#BEC3C9;
}
.inputContainer input:focus::-webkit-input-placeholder {
    color:#BEC3C9;
}
.inputContainer input:focus::-ms-input-placeholder {
    color:#BEC3C9;
}
.inputContainer .loginBtn{
    background-color: #0A7CFF;
    background-image: none;
    border: 1px solid #0084ff;
    border-radius: 24px;
    color: #fff;
    display: block;
    font-family: Calibre, Helvetica Neue, Segoe UI, Helvetica, Arial, Lucida Grande, sans-serif;
    font-size: 17px;
    font-weight: 600;
    height: 43px;
    width: max-content;
    line-height: 19px;
    margin-bottom: 12px;
    margin-top: 20px;
    padding: 0px 20px 0;
    cursor: pointer;
}
.inputContainer .loginBtn:hover{
    background-color: #4d4dff;
    border-color: #4d4dff;
}
.inputContainer .loginBtn:active{
    background-color: #0077e5;
    border: 1px solid transparent;
    opacity: .2;
}

.keep{
    display: flex;
    margin: 25px 0 20px;  
    justify-content: center;
}
.keep input{
    height: 16px;
    top: 1px;
    width: 16px;
    margin: 0;
}
.keep .text{
    color: #595959;
    font-size: 13px;
    line-height: 15px;
    margin-left: 10px;
}
.error-container{
    color: red;
    font-size: 17px;
}
@media only screen and (max-width:400px){
.inputContainer{
    width: 100% !important;
}
.email,.password,.name{
    width: 100% !important;
}
}

</style>
{#if allowed}
<div class="container">
    <div class="title">Sign Up</div>
    <img src="./imgs/logo.png" alt="logo">
   <div class="title">Messenger</div>
   
   <form on:submit|preventDefault={doSubmit} class="inputContainer">
    {#if errorMessage}
    <div class="error-container">
        {errorMessage}
    </div>
    {/if}

    <input type="email" bind:this={form.email} class="email" placeholder="Email"/>
    <input type="password" bind:this={form.password} class="password" placeholder="Password"/>
    <input type="password" bind:this={form.repassword} class="password" placeholder="Confirm Password"/>
    <input type="text" bind:this={form.name} class="name" placeholder="Display Name"/>
    <button class="loginBtn">Sign Up</button>


    <div class="keep">
        <label  class="input">
            <input type="checkbox" id="check" />
        </label>
        
        <label for="check" class="text">Keep me signed in</label>
    </div>


</div>

{/if}