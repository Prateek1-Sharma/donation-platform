// async function showOrganisations(event){
//   const token=localStorage.getItem("token");
//   console.log(token);
//   const ul=document.getElementById("organisation-list");

//   const searchInput=document.getElementById("searchInput")
//   ul.innerHTML='';
//   event.preventDefault();
//   console.log("this is user.js client side");
//   const res=await axios.get("http://localhost:4000/user/oranisationList")
//   console.log(res);
//    const organisationList=res.data
//    console.log(organisationList[0].name);
//    searchInput.addEventListener("input",()=>{
//     const searchTerm=searchInput.value.toLowerCase();
//     console.log(ul.children[0]);
//     ul.children[0].style.display="none";
//     console.log("search term",searchTerm);
//    organisationList.forEach(element=>{
//     const filterOrganisations=element.name.toLowerCase();
//     console.log("filterorganisations",filterOrganisations);
    
//     if(filterOrganisations.includes(searchTerm)){
//       console.log("hi you are in this block");
      
//       ul.innerHTML+=filterOrganisations;
//     }
//     else{
//       ul.innerHTML+='';
//     }
//    })
    
//    })
//   organisationList.forEach(element => {
//      const li=`<form onsubmit='payment(${element.id},event)'><li id='${element.id}'>${element.name}--${element.goal}--<input type='number'id='${element.id}' name=donationAmount required placeholder='donate amount'>--<button type="submit"> Donate </button> </li></form>`;
//      console.log(li);
//      console.log(ul);
//      ul.innerHTML+=li;
//     console.log(element);
    
//   });

// }

const donatedOrganisations=document.getElementById("donationHistory");
async function showOrganisations(event) {
  event.preventDefault();
  
  const token = localStorage.getItem("token");
  console.log(token);

  const ul = document.getElementById("organisation-list");
  
 
  let searchInput = document.getElementById("searchInput");
  if (!searchInput) {
      searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.id = 'searchInput';
      searchInput.placeholder = 'Search Organisations';
      ul.appendChild(searchInput);
  }

  ul.innerHTML = '';
  ul.appendChild(searchInput);  

  console.log("this is user.js client side");

  try {
      const res = await axios.get("http://localhost:4000/user/oranisationList", {
          headers: { "Authorization": token }
      });
      const organisationList = res.data;
      console.log(organisationList[0].name);

      const renderOrganisationList = (list) => {
          ul.innerHTML = '';
          ul.appendChild(searchInput);  

          list.forEach(element => {
              const form = document.createElement('form');
              form.onsubmit = function(event) {
                  event.preventDefault();
                  payment(element.id, event);
              };

              const li = document.createElement('li');
              li.id = element.id;
              
              const nameText = document.createTextNode(`${element.name}--${element.goal}--`);
              
              const input = document.createElement('input');
              input.type = 'number';
              input.name = 'donationAmount';
              input.required = true;
              input.placeholder = 'Donate amount';

              const button = document.createElement('button');
              button.type = 'submit';
              button.innerText = 'Donate';

              li.appendChild(nameText);
              li.appendChild(input);
              li.appendChild(button);
              form.appendChild(li);
              ul.appendChild(form);
          });
      };

  
      renderOrganisationList(organisationList);

   
      searchInput.addEventListener("input", () => {
          const searchTerm = searchInput.value.toLowerCase();
          const filteredOrganisations = organisationList.filter(org =>
              org.name.toLowerCase().includes(searchTerm) ||
              org.goal.toLowerCase().includes(searchTerm)
          );
          renderOrganisationList(filteredOrganisations);
      });

  } catch (error) {
      console.error('Error fetching organisation list', error);
  }
}

// function payment(id, event) {
//   // Your payment processing code
//   console.log('Processing payment for organisation id:', id);
//   const form = event.target;
//   const li = form.querySelector('li');
//   const nameText = li.childNodes[0].textContent; // Access the name text
//   console.log('Organisation name:', nameText);
// }


async function payment(id,e){
  console.log("donated",id);
  e.preventDefault();
  console.log("hello you are going to Donate");
  const token=localStorage.getItem("token");
  console.log(token);
  let paymentDetails={
    donatedAmount:e.target.donationAmount.value
  }
  console.log(paymentDetails);
  const res=await axios.post("http://localhost:4000/purchase/buyPremium",paymentDetails);
  console.log(res);
  amountToBePaid=res.data.amount;
  
  console.log(res.data.key_id);
  var options={
    "key":res.data.key_id,
    "order_id":res.data.order.id,
    
    //handler function for sucessfull Payment
    "handler":async function(res){
      try{
      let response=await axios.post("http://localhost:4000/purchase/updateStatus",{
        order_id:options.order_id,
        payment_id:res.razorpay_payment_id,
        amount_paid:amountToBePaid,
        organisationId:id
      },{headers:{"Authorization":token}})
      alert("Thankyou for your kind help")
      console.log(response);
      document.getElementById("buy-premiumbtn").style.visibility="hidden";
      localStorage.setItem("token",response.data.token)
    showPremium();
    showLeaderBoard();
    }
    catch(err){
      console.log(err);
    }
    }
  }
  console.log(options);
const rzp1=new Razorpay(options);
rzp1.open();
e.preventDefault();
rzp1.on('payment failed',function(response){
    console.log(response)
    alert('Something Went Wrong')
})

}

async function donationHistory(){
  donatedOrganisations.innerHTML='';
  const token=localStorage.getItem("token");
  console.log(token);
  try{
  const res=await axios.get("http://localhost:4000/user/donationhistory",{headers:{"Authorization":token}})
  console.log(res);
  const donationData=res.data;
  donationData.forEach(element=>{
    const li=`<li id=${element.id}>Amount Donated-${element.amount}--To--${element.organisationName}-on-  ${element.createdAt}</li>`;
    donatedOrganisations.innerHTML+=li;
  })
  }
catch(err){
  console.log(err);
}
}


window.addEventListener("DOMContentLoaded",donationHistory)
