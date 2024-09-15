async function signupOrganisation(event){
    event.preventDefault();
    console.log('1');
    
    let signUpDetails={
        name:event.target.name.value,
        email:event.target.email.value,
        password:event.target.password.value,
        amount:event.target.amountOfOrganisation.value,
        goal:event.target.goalOfOrganisation.value
    }
    console.log(event.target.password.value);
   const res= await axios.post("http://localhost:4000/user/organisation/Signup",signUpDetails);
    console.log(res);
    if(res.status==201){
    alert("Sign Up Sucessfull")
    window.location.href="../login/login.html"
}
}