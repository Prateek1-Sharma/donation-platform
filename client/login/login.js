async function login(event){
    event.preventDefault();
    console.log(event.target.loginEmail.value);
    console.log(event.target.loginPassword.value);
    const selectedRole = document.querySelector('input[name="role"]:checked').value;
    let loginDetails={
        userName:event.target.loginEmail.value,
        userPassword:event.target.loginPassword.value,
        role:selectedRole
    }
    console.log(loginDetails);
    
    try{
        const res=await axios.post("http://localhost:4000/user/login",loginDetails)
        console.log(res);
        localStorage.setItem("token",res.data.token)
        if(res.status===200){
            alert(res.data.message)
            window.location.href="../user/user.html"
        }
        if(res.status===201){
            alert(res.data.message)
            window.location.href="../organisation/organisation.html"
        }

    }
 catch(err){
    if(err.response.status === 401){
        alert(err.response.data.error)
    }
    console.log("error occured",err);
 }

}

