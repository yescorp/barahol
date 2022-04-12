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

     $("#white_background").click(function(){
         $("#white_background").hide();
         $("#order-details").hide();
     });

     $("#close_order").click(function(){
        $("#white_background").hide();
        $("#order-details").hide();
     });
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

    $("#saved").text(data['product']['price']  - data['product']['salesPrice'] + "₸");

    $("#serial-number").text(data['product']['serialNumber']);
    
    $('#category').text(list[data['product']['category']['name']]);

    $('#subcategory').text(data['category']['name']);

    $('#color').text(data['product']['color']['name']);

    $('#brand').text(data['product']['brand']['name']);

    $('#season').text(list[data['product']['season']['name']]);

    $('#style').text(data['product']['style']);

    if(data['clothesCompositions'] != null || data['clothesCompositions'] != undefined){
        for(let i = 0; i < data['clothesCompositions'].length; i++){
            let p = document.createElement('p');

            p.textContent = data['clothesCompositions'][i]['material']['name'] + ": " + data['clothesCompositions'][i]['percent'];
            p.textContent += (data['clothesCompositions'][i]['percent'] > 1) ? "%" : "";
            p.textContent += "\n";
            $("#material")[0].appendChild(p);
        }
    }

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

    if(data['product']['series'].length == 0){
        for(let i = 0; i < data['product']['maxSeriesCount']; i++){
            await fetch('https://api.barahol.kz/series/add', {
                method: "POST", 
                headers: {
                    "Accept": "application/json; charset=utf-8",
                    "Content-Type": "application/json;charset=utf-8"                    
                },
                body: JSON.stringify({
                productId: id
            })});

            let tr = document.createElement('tr');
            let td = document.createElement('td');

            if(data['availableClothesSizes'] != null || data['availableClothesSizes'] != undefined){            
                for(let j = 0; j < data['availableClothesSizes'].length; j++){
                    
                    let label = document.createElement('label');
                    label.classList.add('radio');
                    let input = document.createElement('input');
                    input.value = data['availableClothesSizes'][j]['size']['americanSize'];
                    input.type = 'radio';
                    input.name = i;
                    console.log(input.type);
                    let span = document.createElement('span');
                    span.textContent = data['availableClothesSizes'][j]['size']['americanSize'];

                    label.appendChild(input);                    
                    label.appendChild(span);
                    td.appendChild(label);
                    label.style = "margin-right: 5px;";
                }
            }
            console.log('test');
            tr.appendChild(td);
            $('#sizes')[0].appendChild(tr);
        }
    }
    else {
        for(let i = 0; i < data['product']['maxSeriesCount']; i++){

            let tr = document.createElement('tr');
            let td = document.createElement('td');

            if(data['availableClothesSizes'] != null || data['availableClothesSizes'] != undefined){            
                for(let j = 0; j < data['availableClothesSizes'].length; j++){
                    
                    let label = document.createElement('label');
                    label.classList.add('radio');
                    let input = document.createElement('input');
                    input.value = data['availableClothesSizes'][j]['size']['americanSize'];
                    input.type = 'radio';
                    input.name = i;
                    console.log(input.type);
                    let span = document.createElement('span');
                    span.textContent = data['availableClothesSizes'][j]['size']['americanSize'];

                    label.appendChild(input);                    
                    label.appendChild(span);
                    td.appendChild(label);
                    label.style = "margin-right: 5px;";
                }
            }
            console.log('test');
            tr.appendChild(td);
            $('#sizes')[0].appendChild(tr);
        }
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
    let background_div = document.createElement('div');
    background_div.style = "background-color: #f2f2f2";

    let div = document.createElement('div');
    let form = document.createElement('form');

}