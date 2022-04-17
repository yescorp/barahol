$(document).ready(function(){
    getOrderInfo();
});

async function getOrderInfo(){
    let orderResponse = await fetch("https://api.barahol.kz/order/add", {
        method: "POST",
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
        }
    });

    let orderData = await orderResponse.json();
    console.log(orderData);

    let test = await fetch("https://api.barahol.kz/order/get/" + orderData['id'], {
        method: "GET",
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
        }
    });

    console.log(await test.json());

    test = await fetch("https://api.barahol.kz/order/get/", {
        method: "GET",
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
        }
    });

    console.log(await test.json());
}