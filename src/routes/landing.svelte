<script>
import { links,navigate } from "svelte-routing";
import {auth, user} from '../firebase.js'
import {onMount, onDestroy} from 'svelte'

let opened=false;
const form = {}

let unsubscribeUser = () => {} ;
let allowed = false;
onMount(() => {
    unsubscribeUser = user.subscribe((v) => {
        if (v == undefined) {
            allowed = true
        } else if (v == 0) {
            
        } else {
            navigate("/t")
        }
    })
})


onDestroy(() => {
    unsubscribeUser()
})


const doSubmit = async () => {
       
       
       let lform = Object.fromEntries(Object.entries(form).map(([key, el]) => [key, el.value]))
            await firebase.auth().signInWithEmailAndPassword(lform.email, lform.password)
            .then((user) => {
                navigate("/t")
            })
            .catch((error) => {

                errorMessage = error.message;

            });

          
   };
</script>

<style>


#mobileMenu {
    display: none;
}
.desktopMenu {
    display: flex;
    max-width: 1195px;
    width: 90%;
    justify-content: space-between;
    align-items: center;
    margin-left: 50%;
    transform: translateX(-50%);
    height: 100px;
}
.desktopMenu .menu{
    display: none;
}
.desktopMenu img {
    width: 40px;
    height: 40px;
}

.desktopMenu .items {
    display: flex;
}
.desktopMenu .items .item {
    cursor: pointer;
    margin: 0 15px;
    font-family: Calibre, Helvetica Neue, Segoe UI, Helvetica, Arial,
        Lucida Grande, sans-serif;
    font-size: 17px;
    -webkit-font-smoothing: antialiased;
    font-weight: 500;
    line-height: 50px;
    margin: 0 15px;
    transition: opacity 0.2s ease-in;
}


.container{
    display: flex;
    max-width: 1195px;
    width: 90%;
    justify-content: space-between;
    margin-left: 50%;
    transform: translateX(-50%);
    padding-top: 25px;
}
.leftPart{
    width: 440px;
    justify-content: flex-start;
}
.leftPart .bigTitle {
    background: linear-gradient(
        81.84deg,
        #0099ff -9.4%,
        #a033ff 51.57%,
        #ff5280 84.07%,
        #ff7061 90.59%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-size: 90px;
    background-image: linear-gradient(
        83.84deg,
        #0088ff -6.87%,
        #a033ff 26.54%,
        #ff5c87 58.58%
    );
    font-weight: 600;
    letter-spacing: -4px;
    line-height: 100px;
    margin-bottom: 0;
    text-align: left;
    padding-bottom: 35px;
}
.leftPart .paragraph{
    color: #595959;
    margin: 0 0 38px;
    font-size: 17px;
    font-weight: 400;
    font-family: Calibre, Helvetica Neue, Segoe UI, Helvetica, Arial, Lucida Grande, sans-serif;
}
.loginContainer{
    display: flex;
    flex-direction: column;
}
.loginContainer input{
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
.loginContainer input:focus{
    border: 1px solid #0084ff;
    border-radius: 10px;
    outline: none;

}
.loginContainer input::placeholder {
    color:#939393;
}
.loginContainer input::-webkit-input-placeholder {
    color:#939393;
}
.loginContainer input::-webkit-input-placeholder {
    color:#939393;
}
.loginContainer input::-ms-input-placeholder {
    color:#939393;
}
.loginContainer input:focus::placeholder {
    color:#BEC3C9;
}
.loginContainer input:focus::-webkit-input-placeholder {
    color:#BEC3C9;
}
.loginContainer input:focus::-webkit-input-placeholder {
    color:#BEC3C9;
}
.loginContainer input:focus::-ms-input-placeholder {
    color:#BEC3C9;
}
.loginContainer .loginBtn{
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
    line-height: 19px;
    margin-bottom: 12px;
    margin-top: 20px;
    padding: 0px 20px 0;
    width: auto;
    cursor: pointer;
}
.loginContainer .loginBtn:hover{
    background-color: #4d4dff;
    border-color: #4d4dff;
}
.loginContainer .loginBtn:active{
    background-color: #0077e5;
    border: 1px solid transparent;
    opacity: .2;
}

.btns{
    display: flex;
    align-items: flex-end;
}
.btns a{
    color: #0a7cff;
    font-size: 15px;
    line-height: 15px;
    margin-bottom: 26px;
    margin-left: 20px;
    text-decoration: underline;
}
.keep{
    display: flex;
    margin: 25px 0 20px;  
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
.stores img {
    height: 44px;
    width: auto;
}
.rightPart{
    width: 50%;
}
.rightPart img{
    margin-top: 30px;
    max-width: 100%;
    width: auto;
    height: auto;
}
.desktopMenu .item .el{
        cursor: pointer;
        position: relative;
        width: max-content;
    }
.item.first .el::after{
        background-color: #0a7cff;
        border-radius: 1.5px;
        bottom: -6px;
        content: '';
        height: 3px;
        left: 0;
        position: absolute;
        width: 100%;
    }
.desktopMenu .item .el:hover::after{
        background-color: #0a7cff;
        border-radius: 1.5px;
        bottom: -6px;
        content: '';
        height: 3px;
        left: 0;
        position: absolute;
        width: 100%;
}

.desktopMenu .close{
    display: none;
}

@media only screen and (max-width:1025px){
    .container{
        flex-direction: column;
        align-items: center;
    }
    .leftPart .bigTitle{
        text-align: center;
        font-size: 59px;
        line-height: 65px;
    }
    .leftPart .paragraph{
        text-align: center;
    }
    .loginContainer input{
        width: 100%;
    }
    .rightPart{
        width: 100%;
    }
   
    
}
@media only screen and (max-width:1250px){
    .container{
        justify-content: center;
    }
}
@media only screen and (max-width:800px){
    .bigTitle,.paragraph{
        user-select: none;
    }
   
    .container{
        margin-top: 50px;
    }
    .leftPart .bigTitle{
        text-align: left;
        font-size: 50px;
        line-height: 60px;
    }
    .desktopMenu .items{
        display: none;
    }
    .desktopMenu{
        align-items: center;
    }
    .desktopMenu .menu{
        cursor: pointer;
        height: 23px;
        width: 40px;
        display: block;
    }
    .desktopMenu .menu.opened{
        display: none !important;
    }
    .desktopMenu .close.opened{
        cursor: pointer;
        width: 23px;
        stroke: rgba(0, 0, 0, 1);
        display: block;
    }
    .leftPart{
        width: 100%;
    }
    .btns{
        flex-wrap: wrap;
    }
    #mobileMenu{
        position: fixed;
        display: none;
        background-color: white;
        z-index: 2;
        width: 100vw;
        height: 120vh;
        overflow-y: hidden;
        overflow-x: hidden;
        opacity: 0;
    }
    #mobileMenu.opened{
        transition: all 0.3s;
        -webkit-transition: all 0.3s;
       
        opacity: 1;
       
    }
   
    #mobileMenu .items{
    width: 100%;
    user-select: none;
    }
    #mobileMenu .item{
        color: #7D7D7D;
        background-color: #fafafa;
        display: block;
        line-height: 1;
        margin-top: 10px;
        padding: 33px 0 33px 40px;
        font-size: 30px;
        font-weight: 600;
    }
    #mobileMenu .item .el{
        cursor: pointer;
        position: relative;
        width: max-content;
    }
    
    #mobileMenu .item:hover{
        color: black;
    }
    .item.first{
        color: black !important;
    }

    #mobileMenu .item .el{
        cursor: pointer;
        position: relative;
        width: max-content;
    }
    .item.first .el::after{
            background-color: #0a7cff;
            border-radius: 1.5px;
            bottom: -6px;
            content: '';
            height: 3px;
            left: 0;
            position: absolute;
            width: 100%;
        }
        #mobileMenu .item .el:hover::after{
            background-color: #0a7cff;
            border-radius: 1.5px;
            bottom: -6px;
            content: '';
            height: 3px;
            left: 0;
            position: absolute;
            width: 100%;
    }
    
}



</style>

{#if allowed}
<nav class="desktopMenu" id="desktopMenu">
    <div class="logo"><img src="./imgs/logo.png" alt="messenger" /></div>
    <div class="items">
        <div class="item first"><div class="el">Rooms</div></div>
        <div class="item"><div class="el">Features</div></div>
        <div class="item"><div class="el">Privacy & Safety</div></div>
        <div class="item"><div class="el">For Developers</div></div>
    </div>
    <div class="menu" class:opened on:click="{()=>opened=!opened}"><svg class="_messengerMarketingSVG__root" viewBox="0 0 40 23" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><g transform="translate(-299 -40)"><g transform="translate(299 40)"><rect y="4" width="40" height="3"></rect><rect y="14" width="40" height="3"></rect></g></g></g></svg></div>
    <div class="close" class:opened on:click="{()=>opened=!opened}"><svg class="_messengerMarketingSVG__root" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd" stroke-linecap="square"><g class="_90nc" transform="translate(-306 -38)" fill-rule="nonzero" stroke-width="2"><g transform="translate(307 39)"><path transform="translate(11.743 11.626) rotate(-45) translate(-11.743 -11.626)" d="m-2.8154 11.774h29.428"></path><path transform="translate(11.314 11.314) rotate(45) translate(-11.314 -11.314)" d="m-3.2451 11.462h29.428"></path></g></g></g></svg></div>
</nav>

<nav id="mobileMenu" class="mobileMenu" class:opened>
    <div class="items">
        <div class="item first"><div class="el">Rooms</div></div>
        <div class="item"><div class="el">Features</div></div>
        <div class="item"><div class="el">Privacy & Safety</div></div>
        <div class="item"><div class="el">For Developers</div></div>
    </div>
</nav>

<div class="container">
    <div class="leftPart">
        <div class="bigTitle">Hang out <br>anytime, anywhere</div>
        <div class="paragraph">
            Messenger makes it easy and fun to stay close to your favorite
            people.
        </div>
        <div class="loginContainer">
            <input type="email" bind:this={form.email} class="email" placeholder="Email or phone number"/>
            <input type="password" bind:this={form.password} class="password" placeholder="Password"/>
            <div class="btns">
                <button class="loginBtn" on:click='{doSubmit}'>Log In</button>
                <a href="#" class="forget">Forget your password?</a>
                <a href="/signup" use:links class="forget">Sign Up</a>
            </div>
            
        </div>
        <div class="keep">
            <label  class="input">
                <input type="checkbox" id="check" />
            </label>
            
            <label for="check" class="text">Keep me signed in</label>
        </div>
        <div class="stores">
            <a href="https://apps.apple.com/us/app/messenger/id1480068668?mt=12" target="_blank">
                <img src="./imgs/appStore.svg" alt="apple" />
            </a>
            <a href="https://www.microsoft.com/en-us/p/messenger/9wzdncrf0083" target="_blank">
                <img src="./imgs/microsoft.svg" alt="microsoft" />
            </a>
        </div>
    </div>

    <div class="rightPart">
        <img src="./imgs/right.png" alt="right" />
    </div>
</div>
{/if}