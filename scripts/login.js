
async function login(){

    const queryString = window.location.search;
    console.log(queryString);
    urlParams = new URLSearchParams(queryString);

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

        if(urlParams.get('back') == "true"){
            history.go(-1);
            return;
        }
        
        window.location.replace("/pages/main_page.html");
    }

    else {
        $('<p>Неверный логин или пароль</p>').appendTo('#wrong_text');
        $('#wrong_text').css('color' , 'red');
        $('#logemail').css('border' , '1px solid red');
        $('#logpass').css('border' , '1px solid red');
        $('#logpass').css('color' , 'red');
        $('#logemail').css('color' , 'red');
        
        alert("Произошла ошибка при попытке авторизации");
    }
    
    return false;
}

async function registration(){
    var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
    var email = $('#regemail').val();
	// emailReg = /^([w-.]+@([w-]+.)+[w-]{2,4})?$/;

    
    if($("#regname").val().length < 3  ){
        $('p').remove();
        $('<p>Имя должно содержать не менее 3 символов </p>').appendTo('#wrong_textName');
        $('#wrong_textName').css('color' , 'red');
        $('#wrong_textName').css('text-align' , 'left');
        $('#regname').css('border' , '1px solid red');
        return false;
    }else{
        $('#regname').css('border' , 'none');
        $('p').remove();
    }



    if($("#regsurname").val().length < 3  ){
        $('p').remove();
        $('<p>Фамилия должно содержать не менее 3 символов </p>').appendTo('#wrong_textSurname');
        $('#wrong_textSurname').css('color' , 'red');
        $('#wrong_textSurname').css('text-align' , 'left');
        $('#regsurname').css('border' , '1px solid red');
        return false;
    }else{
        $('#regsurname').css('border' , 'none');
        $('p').remove();
    }

    
    if(!pattern.test(email) || email == '')
    {   
        $('p').remove();
        $('<p>Введите корректный  email</p>').appendTo('#wrong_textEmail');
        $('#wrong_textEmail').css('color' , 'red');
        $('#wrong_textEmail').css('text-align' , 'left');
        $('#regemail').css('border' , '1px solid red');
        return false;
    }
    else{
        $('#regemail').css('border' , 'none');
        $('p').remove();
    }

    if($("#regpassone").val() != $("#regpasstwo").val() ){
        $('<p>Пароли не совпадают</p>').appendTo('#wrong_textPass1');
        $('<p>Пароли не совпадают</p>').appendTo('#wrong_textPass2');

        $('#regpassone').css('border' , '1px solid red');
        $('#regpassone').css('color' , 'red');

        $('#regpasstwo').css('border' , '1px solid red');
        $('#regpasstwo').css('color' , 'red');

        $('#wrong_textPass1').css('color' , 'red');
        $('#wrong_textPass1').css('text-align' , 'left');
        $('#wrong_textPass2').css('color' , 'red');
        $('#wrong_textPass2').css('text-align' , 'left');
    
        return false;
    }

    else{
        const queryString = window.location.search;
        console.log(queryString);
        urlParams = new URLSearchParams(queryString);
    
    
    
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
    
            if(urlParams.get('back') == "true"){
                history.go(-1);
                return;
            }
    
            window.location.replace("/pages/main_page.html");
        }
        else {
            alert("Произошла ошибка при авторизации");
        }
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