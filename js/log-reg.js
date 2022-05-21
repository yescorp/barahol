$(document).ready(function(){

    refreshTokens();
    names();
    order();
  });

  async function names(){
    let userInfo = await fetch("https://api.barahol.kz/account/info", {
        method: "POST",
            headers: {
                "Accept": "application/json; charset=utf-8",
                "Content-Type": "application/json;charset=utf-8",
                "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
            }
        });
            // Информация о юзере в профиле 
        let data =  await userInfo.json();
        $("#email").val(data['email']);
        $("#name").val(data['name'] + ' '+ data['surname'] ) ;

  }

  async function order(){

   await refreshTokens();
    let result1 = await fetch("https://api.barahol.kz/order/get", {
        method: "GET",
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
        }
    });

    let orderData = await result1.json();
    for(i = 0 ; i < orderData.length ; i++){
        
        var result = await fetch("https://api.barahol.kz/order/get/" + orderData[i]['orderId'], {
            method: "GET",
            headers: {
                "Accept": "application/json; charset=utf-8",
                "Content-Type": "application/json;charset=utf-8",
                "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
            }
        });
        let datas = await result.json();
        let table = document.getElementById('table');
        if( orderData[i] == null || orderData[i].length == 0){
            return;
        }else{
            var row = table.insertRow(i);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            cell1.innerHTML = orderData[i]['orderId'];
            cell2.innerHTML = datas['orderedDate'];
            cell3.innerHTML = datas['amount'];
            cell4.innerHTML = datas['status'];
        }

    }


  }



  async function refreshTokens(){
    
    if(sessionStorage.getItem("accessToken") == null || sessionStorage.getItem("accessToken") == undefined){
        $("#log").show();
        $("#reg").show();
        $("#prof").hide();
        $("#cart").hide();
        return;
    }


    let checkToken = await fetch("https://api.barahol.kz/account/info", {
    method: "POST",
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
        }
    });

    if(checkToken.status == 200){
        console.log("Tokens are valid");
        $("#log").hide();
        $("#reg").hide();
        $("#prof").show();
        $("#cart").show();
       
    }

    let newTokensResponse = await fetch("https://api.barahol.kz/account/token/refresh",
    {
        method: "POST",
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
        },
        body: JSON.stringify({"refreshToken": sessionStorage.getItem("refreshToken")})
    });

    if(newTokensResponse.status == 200){
        let newTokens = await newTokensResponse.json();
        sessionStorage.setItem("accessToken", newTokens["accessToken"]);
        sessionStorage.setItem("refreshToken", newTokens["refreshToken"]);
        console.log("refreshed tokens");
        $("#log").hide();
        $("#reg").hide();
        $("#prof").show();
        $("#cart").show();
        
     
    }else{
        $("#log").show();
        $("#reg").show();
        $("#prof").hide();
        $("#cart").hide();
    
    }
}



