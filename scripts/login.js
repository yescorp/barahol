async function login(){

    let email = $("#logemail").val();

    let password = $("#logpass").val();

    console.log(email);

    console.log(password);
    
    let result = await fetch("https://api.barahol.kz/account/login/email", {
        method: "POST",
        redirect: 'follow',
                    headers: {
                        "Accept": "application/json; charset=utf-8",
                        "Content-Type": "application/json;charset=utf-8",
                      },
        body: JSON.stringify({
            Identity: email,
            Password: password
        })
    });

    let data = await result.json();

    if(result.status == 200){
        sessionStorage.setItem("accessToken", data["accessToken"]);
        sessionStorage.setItem("refreshToken", data["refreshToken"]);

        await getUserDetails();

        window.location.replace("/pages/main_page.html");
    }

    else {
        alert("Произошла ошибка при попытке авторизации");
    }
    
    return false;
}

async function registration(){

    console.log("Asdasd");

    if($("#regpassone").val() != $("#regpasstwo").val()){
        
        return false;
    }

    let data = {
        Email: $("#regemail").val(),
        Name: $("#regname").val(),
        Surname: $("#regsurname").val(),
        Password: $("#regpasstwo").val()
    };

    let result = await fetch("https://api.barahol.kz/account/registration", {
        method: "POST",
        redirect: 'follow',
                    headers: {
                        "Accept": "application/json; charset=utf-8",
                        "Content-Type": "application/json;charset=utf-8",
                      },
        body: JSON.stringify(data)
    });

    if(result.status == 200){
        let resultData = await result.json();

        sessionStorage.setItem("accessToken", resultData["accessToken"]);
        sessionStorage.setItem("refreshToken", resultData["refreshToken"]);

        await getUserDetails();

        console.log("Success");

        window.location.replace("/pages/main_page.html");
    }
    else {
        alert("Произошла ошибка при авторизации");
    }

    return false;
}

async function getUserDetails(){
    
    let userDataResponse = await fetch("https://api.barahol.kz/account/info", {
    method: "POST",
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
        }
    });

    let userData = await userDataResponse.json();

    sessionStorage.setItem('userId', userData['id']);
}