<script>	
import { Router, Link, Route } from "svelte-routing";
import Landing from "./routes/landing.svelte";
import Chat from "./routes/Chat.svelte"
import SignUp from "./routes/Signup.svelte"
import Login from "./routes/Login.svelte"
  export let url = "";
  
</script>



<Router url="{url}">

	  <Route path="/"><Landing /></Route>
	  <Route path="/signup"><SignUp /></Route>
	  <Route path="/login"><Login /></Route>
	  <Route path="/t" ><Chat /></Route>
	  <Route path="/t/:id" let:params><Chat UrlId="{params.id}" /></Route>
</Router>