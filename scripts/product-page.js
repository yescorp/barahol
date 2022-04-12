var list = {
    'male': 'Мужчинам', 
    'female': 'Женщинам', 
    'unisex': 'Унисекс', 
    'kids': 'Детям',
    'winter': 'Зима',
    'summer': 'Лето',
    'demiseason': 'Демисезон',
    'multiseason': 'Мультисезон',
    'fall': 'Осень'
}


$(document).ready(function(){

    const queryString = window.location.search;
    console.log(queryString);

    urlParams = new URLSearchParams(queryString);

    let id = urlParams.get('id');

    loadProductInfo(id).then(addImagesHoverEvent);
});

async function loadProductInfo(id){
    let result = await fetch("https://api.barahol.kz/product/get/" + id, {method: "GET"});

    if(result.status != 200){
        history.go(-1);
        return;
    }

    let data = await result.json();
    
    $("#title").text(data['product']['name']);

    $("#product-price").text(data['product']['salesPrice'] + "₸");

    $('#old-price').text(data['product']['price'] + "₸");

    $("#saved").text(data['product']['price']  - data['product']['salesPrice']);

    $("#serial-number").text(data['product']['serialNumber']);
    
    $('#category').text(list[data['product']['category']['name']]);

    $('#subcategory').text(data['category']['name']);

    $('#color').text(data['product']['color']['name']);

    $('#brand').text(data['product']['brand']['name']);

    $('#season').text(list[data['product']['season']['name']]);

    $('#style').text(data['product']['style']);

    $('#selected-image')[0].src = 'https://barahol.kz/ProductImages/' + data['product']['productImages'][0]['imageSource'];

    for(let i = 0; i < data['product']['productImages'].length; i++){
        console.log(data['product']['productImages'][i]['imageSource']);
        let li = document.createElement('li');
        let img = document.createElement('img');
        li.appendChild(img);

        img.src = 'https://barahol.kz/ProductImages/' + data['product']['productImages'][i]['imageSource'];
        img.classList.add('product-images');
        $('#image-list')[0].append(li);
    }
}

async function addImagesHoverEvent(){
    $(".product-images").click(function(){
        console.log('clicked');
        console.log($(this)[0].src);
        $("#selected-image")[0].src = $(this)[0].src;
    });
}