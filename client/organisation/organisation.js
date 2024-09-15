const ul=document.getElementById("donor-list");
const totalAmount=document.getElementById("totalAmount");
async function organisation(event){
    ul.innerHTML="";
    totalAmount.innerHTML="";
    event.preventDefault();
    const token=localStorage.getItem("token");
    console.log(token);
    try{
    const res=await axios.get('http://localhost:4000/donorlist',{headers:{"Authorization":token}})
    console.log(res.data.combinedData);
    const donations =res.data.combinedData
    let sum=0;
    donations.forEach(element => {
        console.log(element.amount);
        const li=`<li id=${element.id}>${element.amount}--by-${element.userName}</li>`
        ul.innerHTML+=li;
        sum += parseFloat(element.amount); 
        
});
totalAmount.innerHTML+=sum
    }
    catch (error) {
        console.error('Error fetching donor list', error);
    }
}