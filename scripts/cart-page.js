let orderId;

$(document).ready(function(){
    const queryString = window.location.search;
    console.log(queryString);
    urlParams = new URLSearchParams(queryString);

    $("#back-to-shop").click(function(){
        if(urlParams.get('back') == "true"){
            history.go(-1);
        }
        else {
            window.location = "/pages/main_page.html";
        }
    })

    getOrderInfo().then(addRemoveEventListener).then(addImageClickEvent);
});

function addImageClickEvent(){
    $(".img-fluid").click(function(){
        window.location = "/pages/product-page.html?id=" + $(this).attr('product-id');
    });
}

function addRemoveEventListener(){
    $('.close').click(function(){
        console.log('remove item ');

        let removeData = {
            orderId: orderId,
            orderItemId: parseInt(this.id)
        };

        console.log(removeData);

        fetch('https://api.barahol.kz/order/item/remove', {
            method: "POST",
            headers: {
                "Accept": "application/json; charset=utf-8",
                "Content-Type": "application/json;charset=utf-8",
                "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
            },
            body: JSON.stringify(removeData)
        
        }).then(function(){
            window.location.reload()    
        });
    });
}

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
    orderId = orderData['orderId'];
    
    $("#getCheckout").click(function(){
        getCheckout(orderData['orderId']);
    });

    let result = await fetch("https://api.barahol.kz/order/get/" + orderId, {
        method: "GET",
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
        }
    });

    let data = await result.json();

    $("#item-count").text("Количество: " + data['orderItems'].length);

    console.log(data);
    
    let productCache = [];

    for(let i = 0; i < data['orderItems'].length; i++){

        let productImage;
        if(!(data['orderItems'][i]['productId'] in productCache)){
            let product = await fetch("https://api.barahol.kz/product/get/" + data['orderItems'][i]['productId'], {method: "GET"});
            product = await product.json();
            console.log(product);

            productImage = product['productImages'][0]['imageSource'];
            productCache[data['orderItems'][i]['productId']] = [];
            productCache[data['orderItems'][i]['productId']]['img'] = productImage;
            productCache[data['orderItems'][i]['productId']]['title'] = product['name'];
        }
        else {
            productImage = productCache[data['orderItems'][i]['productId']]['img'];
        }

        let container = document.createElement('div');
        container.classList.add('row');
        container.classList.add('border-top');
        container.classList.add('border-bottom');

        let innerContainer = document.createElement('div');
        innerContainer.classList.add('row');
        innerContainer.classList.add('main');
        innerContainer.classList.add('align-items-center');

        let imgContainer = document.createElement('div');
        imgContainer.classList.add('col-2');

        let img = document.createElement('img');
        img.classList.add('img-fluid');
        img.classList.add('product-img');
        img.setAttribute('product-id', data['orderItems'][i]['productId']);

        img.src = 'https://barahol.kz/ProductImages/' + productImage;
        

        let title = document.createElement('div');
        title.classList.add('col');

        let titleInner = document.createElement('div');
        titleInner.classList.add('row');

        titleInner.textContent = productCache[data['orderItems'][i]['productId']]['title'];

        let size = document.createElement('div');
        size.classList.add('col');

        size.textContent = data['orderItems'][i]['size'];

        let amount = document.createElement('div');
        amount.classList.add('col');
        amount.textContent = data['orderItems'][i]['actualPrice'];

        let span = document.createElement('span');
        span.innerHTML = "&#10005;";
        span.classList.add('close');    
        span.id = data['orderItems'][i]['orderItemId'];

        imgContainer.appendChild(img);
        innerContainer.appendChild(imgContainer);
        title.appendChild(titleInner);
        innerContainer.appendChild(title);
        innerContainer.appendChild(size);
        amount.appendChild(span);
        innerContainer.appendChild(amount);
        
        container.appendChild(innerContainer);

        $("#items-container")[0].appendChild(container);
    }
    //$("#cart")[0].innerHTML +=  '<div class="back-to-shop"><p id="back-to-shop-bottom">&leftarrow; <span class="text-muted">Вернуться в магазин</span></p></div>';
}

async function getCheckout(){
    let city = $("#city").val();
    let mail_index = $("#mail-index").val();
    let physical_address = $("#physical-address").val();

    let bodyData = {
        orderId: orderId,
        address: {
            cityName: city,
            physicalAddress: physical_address,
            mailIndex: mail_index
        }
    };

    console.log(bodyData);

    let paymentResponse = await fetch("https://api.barahol.kz/payment/create", {
        method: "POST",
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": "Bearer " + sessionStorage.getItem("accessToken")
        },
        body: JSON.stringify(bodyData)
    });

    if(paymentResponse.status == 200){
        window.location = (await paymentResponse.json())['checkoutUrl'];
    }
}