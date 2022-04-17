$(document).ready(function(){
    

    
    refreshTokens();
    names();


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

        let data =  await userInfo.json();
        console.log(data['id']);

        $("#email").val(data['email']);
        $("#name").val(data['name']);
        $("#surname").val(data['surname']);

        console.log(data);
  }





  async function refreshTokens(){
    


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
        
     
    }else{
        $("#log").show();
        $("#reg").show();
        $("#prof").hide();
    
    }
    test();
}



