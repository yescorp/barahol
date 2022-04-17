// $(document).ready(function(){

// order();

    
// });


// async function order(){
//     let result1 = await fetch("https://api.barahol.kz/order/get/", {
//         method: "GET",
//         headers: {
//             "Accept": "application/json; charset=utf-8",
//             "Content-Type": "application/json;charset=utf-8",
//             "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
//         }
//     });

// let result = await fetch("https://api.barahol.kz/order/get/" + orderData['orderId'], {
//         method: "GET",
//         headers: {
//             "Accept": "application/json; charset=utf-8",
//             "Content-Type": "application/json;charset=utf-8",
//             "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
//         }
//     });

//     result1.status;
//     let data = await result1.json()
//     console.log("asdas");

//     console.log(data);

//   }