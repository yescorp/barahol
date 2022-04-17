var list = {
    'male': 'Мужская одежда', 
    'female': 'Женская одежда', 
    'unisex': 'Одежда унисекс', 
    'kids': 'Десткая одежда',
    'winter': 'Зима',
    'summer': 'Лето',
    'demiseason': 'Демисезон',
    'multiseason': 'Мультисезон',
    'fall': 'Осень'
}

var type = "clothes";

$(document).ready(function(){

    $("#white_background").hide();
    $("#sizes_container").hide();

    const queryString = window.location.search;
    console.log(queryString);

    urlParams = new URLSearchParams(queryString);

    let id = urlParams.get('id');

    loadProductInfo(id).then(addImagesHoverEvent);

     $("#white_background").click(function(){
         $("#white_background").hide();
         $("#sizes_container").hide();
     });

     $("#close_order").click(function(){
         console.log("clicked");
        $("#white_background").hide();
        $("#sizes_container").hide();
     });

     $("#order").click(function(){
        $("#white_background").show();
        $("#sizes_container").show();
        scrollTo(0, 0);
     });

     $("#add-to-cart").click(function(){
        createOrder(id);
     });
});

async function loadProductInfo(id){
    let result = await fetch("https://api.barahol.kz/product/get/" + id, {method: "GET"});

    if(result.status != 200){
        history.go(-1);
        return;
    }

    let data = await result.json();

    try{
        DisplayClothesSeries(data);
        type = "clothes";
    }
    catch(e){}

    try{
        DisplayShoesSeries(data);
        type = "shoes";
    } catch(e){}

    try{
        DisplayAccessorySeries(data);
        type = "accessory";
    }
    catch(e){}

    switch(type){
        case "clothes":
            break;
        case "shoes":
            break;
        case "accessory":
            break;
    }

    $("#title").text(data['name']);

    $("#product-price").text(data['salesPrice'] + "₸");

    $('#old-price').text(data['price'] + "₸");

    $("#saved").text(data['price']  - data['salesPrice'] + "₸");

    $("#serial-number").text(data['serialNumber']);
    
    $('#category').text(list[data['category']['name']]);

    $('#subcategory').text(data['subcategory']['name']);

    $('#color').text(data['color']['name']);

    $('#brand').text(data['brand']['name']);

    $('#season').text(list[data['season']['name']]);

    $('#style').text(data['style']);

    try{
        let difference = new Date(new Date(data['endDate'])).getTime() - new Date().getTime(); 
        let seconds = parseInt((difference / 1000) % 60);

        seonds = (seconds > 10 ? seconds : "0" + seconds);

        let minutes = parseInt((difference / (1000 * 60)) % 60);
        
        minutes = (minutes > 10 ? minutes : "0" + minutes);

        let hours = parseInt((difference / (1000 * 3600)) % 24);
        hours = (hours > 10 ? hours : "0" + hours);

        let days = parseInt(difference / (1000 * 3600 * 24));
        console.log(new Date(data['endDate']));
        console.log(new Date());
        $("#end-date").text("Осталось: " + days + ":"+ hours + ":" + minutes + ":" + seconds);
    }
    catch(e){}    

    setInterval(() => {
        try{
            let difference = new Date(new Date(data['endDate'])).getTime() - new Date().getTime(); 
            let seconds = parseInt((difference / 1000) % 60);

            seonds = (seconds > 10 ? seconds : "0" + seconds);

            let minutes = parseInt((difference / (1000 * 60)) % 60);
            
            minutes = (minutes > 10 ? minutes : "0" + minutes);

            let hours = parseInt((difference / (1000 * 3600)) % 24);
            hours = (hours > 10 ? hours : "0" + hours);
            let days = parseInt(difference / (1000 * 3600 * 24));

            $("#end-date").text("Осталось: " + days + ":"+ hours + ":" + minutes + ":" + seconds);
        }
        catch(e){}    
    }, 1000);
    

    try{
        if(data['material'][0]['material'] != null && data['material'][0]['material'] != undefined){
            let p = document.createElement('p');
            p.textContent = "";
            for(let i = 0; i < data['material'].length; i++){
                p.textContent += data['material'][i]['material']['name'] + ": " + data['material'][i]['percent'] + "\n";
            }
            $("#material")[0].appendChild(p);
        }
    }

    catch(e){}

    try{    
        if(data['material'] != null && data['material'] != undefined){
            let p = document.createElement('p');
            p.textContent = data['material']['name'];
            $("#material")[0].appendChild(p);
        }
    } catch(e){}

    $('#selected-image')[0].src = 'https://barahol.kz/ProductImages/' + data['productImages'][0]['imageSource'];

    for(let i = 0; i < data['productImages'].length; i++){
        console.log(data['productImages'][i]['imageSource']);
        let li = document.createElement('li');
        let img = document.createElement('img');
        li.appendChild(img);

        img.src = 'https://barahol.kz/ProductImages/' + data['productImages'][i]['imageSource'];
        img.classList.add('product-images');
        $('#image-list')[0].append(li);
    }

    let isSeriesCreated = false;

    let series_result = await fetch('https://api.barahol.kz/series/add', {
        method: "POST", 
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json;charset=utf-8"                    
        },
        body: JSON.stringify({
        productId: id
        })});
    if(series_result.status == 200){
        isSeriesCreated = true;
    }

    while (series_result.status == 200){
        series_result = await fetch('https://api.barahol.kz/series/add', {
        method: "POST", 
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json;charset=utf-8"                    
        },
        body: JSON.stringify({
        productId: id
        })});
    }

    if(isSeriesCreated == true){
        window.location.reload();
    }
}

async function addImagesHoverEvent(){
    $(".product-images").click(function(){
        console.log('clicked');
        console.log($(this)[0].src);
        $("#selected-image")[0].src = $(this)[0].src;
    });
}

function display_order_menu(){
    $("#white_background").show();
    $("#order-details").show();
    window.scroll(0, 0);
}

function DisplayClothesSeries(data){

    for(let j = 0; j < data['series'].length; j++){
        let tr = document.createElement('tr');
        let td = document.createElement('td');

        for(let i = 0; i < data['series'][j]['productSeries'].length; i++){
            
            let input = document.createElement('input');
            input.classList.add("btn-check");
            input.value = data['series'][j]['productSeries'][i]['clothesSize']['americanSize'];
            input.type = 'checkbox';
            input.id = 'series-' + data['series'][j]['seriesId'] + '-size-' + data['series'][j]['productSeries'][i]['sizeId']
            input.setAttribute('autocomplete', "off");
            
            
            let label = document.createElement('label');
            label.textContent = data['series'][j]['productSeries'][i]['clothesSize']['americanSize'];
            label.classList.add('btn');
            label.classList.add('btn-outline-dark')
            label.setAttribute('for', input.id);

            input.style = 'visibility: hidden;';

            if(data['series'][j]['productSeries'][i]['isAvailable'] == false){
                input.disabled = true;
                label.classList.remove('btn-outline-dark');
                label.classList.add('btn-secondary');
                label.classList.add('booked');
            }
            
            td.appendChild(input);
            td.appendChild(label);

            label.addEventListener('click', function(){
                if($("#" + this.getAttribute('for'))[0].checked == false){
                    this.classList.remove('btn-outline-dark');
                    this.classList.add('btn-dark');
                }
                else {
                    this.classList.remove('btn-dark');
                    this.classList.add('btn-outline-dark');    
                }
            });
            
        }

        tr.appendChild(td);
        
        $('#sizes')[0].appendChild(tr);
    }
}

function DisplayShoesSeries(data){

    for(let j = 0; j < data['series'].length; j++){
        let tr = document.createElement('tr');
        let td = document.createElement('td');

        for(let i = 0; i < data['series'][j]['productSeries'].length; i++){
            
            let input = document.createElement('input');
            input.classList.add("btn-check");
            input.value = data['series'][j]['productSeries'][i]['shoesSize']['size'];
            input.type = 'checkbox';
            input.id = 'series-' + data['series'][j]['seriesId'] + '-size-' + data['series'][j]['productSeries'][i]['sizeId']
            input.setAttribute('autocomplete', "off");
            
            console.log(input.type);
            
            let label = document.createElement('label');
            label.textContent = data['series'][j]['productSeries'][i]['shoesSize']['size'];
            label.classList.add('btn');
            label.classList.add('btn-outline-dark')
            label.setAttribute('for', input.id);

            input.style = 'visibility: hidden;';

            if(data['series'][j]['productSeries'][i]['isAvailable'] == false){
                input.disabled = true;
                label.classList.remove('btn-outline-dark');
                label.classList.add('btn-secondary');
                label.classList.add('booked');
            }
            
            td.appendChild(input);
            td.appendChild(label);

            label.addEventListener('click', function(){
                console.log($("#" + this.getAttribute('for'))[0].checked);
                if($("#" + this.getAttribute('for'))[0].checked == false){
                    this.classList.remove('btn-outline-dark');
                    this.classList.add('btn-dark');
                }
                else {
                    this.classList.remove('btn-dark');
                    this.classList.add('btn-outline-dark');    
                }
            });
            
        }

        console.log('test');
        tr.appendChild(td);
        
        $('#sizes')[0].appendChild(tr);
    }
}

function DisplayAccessorySeries(data){
    if(data['series'][0]['productSeries'][0]['count'] == null || data['series'][0]['productSeries'][0]['count'] == undefined){
        console.log()
        throw "sd";
    }

    for(let j = 0; j < data['series'].length; j++){
        let tr = document.createElement('tr');
        let td = document.createElement('td');

        for(let i = 0; i < data['series'][j]['productSeries'][0]['count']; i++){

            let input = document.createElement('input');
            input.classList.add("btn-check");
            input.value = i;
            input.type = 'checkbox';
            input.id = 'series-' + data['series'][j]['seriesId'] + '-size-' + i;
            input.setAttribute('autocomplete', "off");
            
            console.log(input.type);
            
            let label = document.createElement('label');
            label.textContent = i + 1;
            label.classList.add('btn');
            label.classList.add('btn-outline-dark')
            label.setAttribute('for', input.id);

            input.style = 'visibility: hidden;';
            
            td.appendChild(input);
            td.appendChild(label);

            label.addEventListener('click', function(){
                console.log($("#" + this.getAttribute('for'))[0].checked);
                if($("#" + this.getAttribute('for'))[0].checked == false){
                    this.classList.remove('btn-outline-dark');
                    this.classList.add('btn-dark');
                }
                else {
                    this.classList.remove('btn-dark');
                    this.classList.add('btn-outline-dark');    
                }
            });
            
        }
        if(data['series'][j]['productSeries'][0]['count'] > 0){
            console.log('test');
            tr.appendChild(td);
            $('#sizes')[0].appendChild(tr);
        }
        
    }
}

async function createOrder(productId){
    let orderResponse = await fetch("https://api.barahol.kz/order/add", {
            method: "POST",
            headers: {
                "Accept": "application/json; charset=utf-8",
                "Content-Type": "application/json;charset=utf-8",
                "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
            }
        });
    

    if(orderResponse.status == 401){
        window.location = '/pages/login-page.html?back=true';
    }

    console.log(orderResponse);

    let orderId = (await orderResponse.json())['orderId'];

    let values = $("#sizes input[type='checkbox']:checked");

    for(let i = 0; i < values.length; i++){
        console.log(values[i].value);
        console.log(values[i]);
        console.log(orderId);
        let series_id = values[i].id.split("-")[1];
        console.log(series_id);

        let orderItemrequest = await fetch("https://api.barahol.kz/order/item/add", {
            method: "POST",
            headers: {
                "Accept": "application/json; charset=utf-8",
                "Content-Type": "application/json;charset=utf-8",
                "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
            },
            body: JSON.stringify({
                orderId: orderId, 
                seriesId: series_id,
                productId: productId,
                size: values[i].value
            })
        });

        if(orderItemrequest.status == 401){
            refreshTokens();
        }

        if(orderItemrequest.status == 200){
            console.log("success");
            values[i].disabled = true;
            let div = document.createElement('div');
            div.classList.add('alert');
            div.classList.add('alert-dismissible');
            div.classList.add('show');
            div.classList.add('alert-success');
            div.setAttribute('role', 'alert');
            div.textContent = "Товар " + values[i].value + " успешно добавлен в корзину";

            div.style = "position: fixed; right: 0; top: 80px; z-index: 10003";

            let button = document.createElement('button');
            button.type = "button";
            button.classList.add('close');
            button.setAttribute('data-dismiss', 'alert');
            button.setAttribute('aria-label', 'Close');

            let span = document.createElement('span');
            span.innerHTML = "&times;";

            button.appendChild(span);

            div.appendChild(button);

            document.body.appendChild(div);
            
        }

        console.log(await orderItemrequest.json());
    }
    $("#white_background").hide();
    $("#sizes_container").hide();
    

        
}