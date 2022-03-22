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
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            }
        });

        let data =  await userInfo.json();
        console.log(data['email']);

        $("#email").val(data['email']);
        $("#name").val(data['email']);
        $("#surname").val(data['email']);

        console.log(data);
  }





  async function refreshTokens(){
    


    let checkToken = await fetch("https://api.barahol.kz/account/info", {
    method: "POST",
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
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
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        body: JSON.stringify({"refreshToken": localStorage.getItem("refreshToken")})
    });

    if(newTokensResponse.status == 200){
        let newTokens = await newTokensResponse.json();
        localStorage.setItem("accessToken", newTokens["accessToken"]);
        localStorage.setItem("refreshToken", newTokens["refreshToken"]);
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



