async function signup(event){
    event.preventDefault();
    let signUpDetails={
        name:event.target.name.value,
        email:event.target.email.value,
        password:event.target.password.value
    }
    console.log(event.target.password.value);
   const res= await axios.post("http://localhost:4000/user/userSignup",signUpDetails);
    console.log(res);
    if(res.status==201){
    alert("Sign Up Sucessfull")
    window.location.href="../login/login.html"
}
}