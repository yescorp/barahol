var urlParams;
var checkboxes = [];
var products;
let russianSeasons = {
    "winter": "Зима",
    "summer": "Лето",
    "fall": "Осень",
    "spring": "Весна",
    "multiseason": "Мультисезон",
    "demiseason": "Демисезон",
    "Зима" :"winter",
    "Лето": "summer",
    "Осень": "fall",
    "Весна": "spring",
    "Мультисезон": "multiseason",
    "Демисезон": "demiseason"
};

$(document).ready(function(){

    $("#apply_filters").on("click", function(){
        console.log("apply filters");
        let params = "";
        
        let count = 0;

        if($("#clothes").is(":checked")){
            params += "clothes=true"
            count++;
        }

        if($("#shoes").is(":checked")){
            if(count > 0) {
                params += "&";
            }
            params += "shoes=true";
            count++;
        }

        if($("#accessories").is(":checked")){
            if(count > 0) {
                params += "&";
            }
            params += "accessories=true";
            count++;
        }

        if(count == 0){
            console.log('returning');
            return false;
        }

        let gender = $("#gender-inner-box input");
        
        if(gender.length > 0){
            params += "&gender="
        }

        for(let i = 0; i < gender.length; i++){
            if(gender[i].checked){
                if(i != 0){
                    params += ",";
                }
                params += gender[i].value;
            }
        }

        let subcategories = $("#subcategory-inner-box input");
        
        if(subcategories.length > 0){
            params += "&subcategories="
        }

        for(let i = 0; i < subcategories.length; i++){
            if(subcategories[i].checked){
                if(i != 0){
                    params += ",";
                }
                params += subcategories[i].value;
            }
        }

        let season = $("#season-inner-box input");
        
        if(season.length > 0){
            params += "&seasons="
        }

        for(let i = 0; i < season.length; i++){
            if(season[i].checked){
                if(i != 0){
                    params += ",";
                }
                params += season[i].value;
            }
        }

        let startPrice = $("#input-left");
        let endPrice = $("#input-right");

        params += "&startPrice=" + startPrice.val();
        params += "&endPrice=" + endPrice.val();

        params += "&page=1";

        window.location = "/pages/filter-page.html?" + params;
    });

    $("#reset_filters").on("click", function(){
        window.location = "/pages/filter-page.html?clothes=true&accessories=true&shoes=true&gender=male,female,kids,unisex&startPrice=0&endPrice=100000&page=1&limit=16";
    });

    let finalParams = "";

    const queryString = window.location.search;
    console.log(queryString);

    urlParams = new URLSearchParams(queryString);

    const clothesUrl = urlParams.get("clothes");
    if(clothesUrl == "true"){
        $("#clothes").prop("checked", true);
        finalParams += "&types=clothes";
    }
    else {
        $("#clothes").prop("checked", false);    
    }


    const shoesUrl = urlParams.get("shoes");
    if(shoesUrl == "true"){
        $("#shoes").prop("checked", true);
        finalParams += "&types=shoes";
    }
    else {
        $("#shoes").prop("checked", false);    
    }

    const accessoryUrl = urlParams.get("accessories");
    if(accessoryUrl == "true"){
        $("#accessories").prop("checked", true);
        finalParams += "&types=accessories";
    }
    else {
        $("#accessories").prop("checked", false);    
    }

    try{
        const genderUrl = urlParams.get("gender").split(",");

        let gender = $("#gender-inner-box input");

        if(genderUrl.length == 0){
            finalParams += "&categories=male&categories=female&categories=unisex&categories=kids"
        }

        for(let i = 0; i < genderUrl.length; i++){
            finalParams += "&categories=" + genderUrl[i];

            for(let j = 0; j < gender.length; j++){
                if(gender[j].value == genderUrl[i]){
                    gender[j].checked = true;
                }
            }
        }
    }
    catch(e){

    }

    try{

    
        const startPriceUrl = parseInt(urlParams.get("startPrice"));

        const endPrice = parseInt(urlParams.get("endPrice"));

        document.getElementById("input-left").value = startPriceUrl;
        document.getElementById("input-right").value = endPrice;

        setLeftValue();
        setRightValue();
    }
    catch(e){}

    try {
        const season = urlParams.get("seasons").replace(",", "");

        finalParams += "&season=" + season;
    }
    catch(e){}

    try {
        const subcategories = urlParams.get("subcategories").split(",");
        if(subcategories.length != 0 && subcategories[0] != ""){
            for(let i = 0; i < subcategories.length; i++)
            {    
                finalParams += "&subcategories=" + subcategories[i];
            }            
        }

    }
    catch(e){}

    try{
        
        let startPrice = $("#input-left");
        let endPrice = $("#input-right");

        finalParams += "&startPrice=" + startPrice.val();
        finalParams += "&endPrice=" + endPrice.val();
    }
    catch(e){}

    createSubcategoryOptions().then(createSeasonOptions).then(checkOptions);
    finalParams += "&limit=16&page=" + urlParams.get('page');
    loadProducts(finalParams);
});

async function loadProducts(params){
    const queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);

    console.log("loading products...\n" + params);
    let result = await fetch("https://api.barahol.kz/product/filter?" + params, {method: "GET"});

    if(result.status == 404){
        let div = document.createElement('div');
        console.log('404');

        div.textContent = "По вашему запросу продуктов не найдено.\nПопробуйте применить другие фильтры";
        div.style = "text-align: right";
        $("#products-super-container").append(div);
        return;
    }
    
    let products = await result.json();
    console.log(products);

    let li1 = document.createElement('li');
    li1.classList.add('page-item');
    let a1 = document.createElement('a');
    a1.classList.add('page-link');

    a1.innerHTML = "&lt;";

    li1.appendChild(a1);

    a1.addEventListener('click', function(){
        let prevPage = urlParams.get('page') - 1;
        if(prevPage > 0){
            urlParams.set('page', prevPage);
            window.location.search = urlParams;
        }
    });

    $("#pagination-1")[0].appendChild(li1);
    

    for(let i = 0; i < products['maxPagesCount']; i++){
        if(i < 3 || i > products['maxPagesCount'] - 3 || (i > urlParams.get('page') - 2 && i < parseInt(urlParams.get('page')) + 2)){

            if(!(i + 1 < 3 || i + 1 > products['maxPagesCount'] - 3 || (i + 1 > urlParams.get('page') - 2 && i + 1 < parseInt(urlParams.get('page')) + 2))){
                let li = document.createElement('li');
                li.classList.add('page-item');
                let a = document.createElement('a');
                a.classList.add('page-link');

                a.textContent = "...";

                li.appendChild(a);

                $("#pagination-1")[0].appendChild(li);
                continue;
            }

            let li = document.createElement('li');
            li.classList.add('page-item');
            let a = document.createElement('a');
            a.classList.add('page-link');
            if(urlParams.get('page') == i + 1){
                li.classList.add('active');
            }

            a.textContent = i + 1;

            li.appendChild(a);

            $("#pagination-1")[0].appendChild(li);

            a.addEventListener('click', function(){
                console.log('page clicked');
                urlParams.set('page', this.text);
                console.log(urlParams.get('page'));

                window.location.search = urlParams;
            });
        }

    }

    let li = document.createElement('li');
    li.classList.add('page-item');
    let a = document.createElement('a');
    a.classList.add('page-link');

    a.innerHTML = "&gt;";

    li.appendChild(a);

    a.addEventListener('click', function(){
        console.log(parseInt(urlParams.get('page')) + 1)
        let nextPage = parseInt(urlParams.get('page')) + 1;
        if(nextPage <= products['maxPagesCount']){
            urlParams.set('page', nextPage);
            window.location.search = urlParams;
        }
    });

    $("#pagination-1")[0].appendChild(li);

    displayProducts(products["products"]);


}

function displayProducts(products){

    let row = document.createElement("div");
    row.classList.add("row");

        for(let j = 0; j < products.length; j++){
            let div1 = document.createElement("div");
            div1.classList.add("col-md-6");
            div1.classList.add("col-lg-4");
            div1.classList.add("col-xl-3");
            div1.classList.add('col-6');

            row.appendChild(div1);

            let div2 = document.createElement("div");
            div2.classList.add("single-product");
            div2.id = products[j]["productId"];

            div2.addEventListener('click', function(){
                window.location = '/pages/product-page.html?id=' + this.id;
            })

            div1.appendChild(div2);

            let first_part = document.createElement("div");
            first_part.classList.add("part-1");
            first_part.style = "background: url('https://barahol.kz/ProductImages/" + products[j]["productImages"][0]['imageSource'] + "') no-repeat center; background-size: contain;";
            
            div2.appendChild(first_part);

            let second = document.createElement("div");
            second.classList.add("part-2");

            div2.appendChild(second);

            let title = document.createElement("h3");
            title.textContent = products[j]['name'];
            title.classList.add("product-title");

            let old_price = document.createElement("h4");
            old_price.textContent =  products[j]['price'] + "₸";
            old_price.classList.add("product-old-price");

            let price = document.createElement("h4");
            price.textContent = products[j]['salesPrice'] + "₸";
            price.classList.add("product-price");

            second.appendChild(title);
            second.appendChild(old_price);
            second.appendChild(price);
        }
        $("#products-super-container").append(row);
}

function checkOptions(){
    const queryString = window.location.search;
    console.log(queryString);

    urlParams = new URLSearchParams(queryString);

    const subcategoriesUrl = urlParams.get("subcategories")?.split(",") ?? [];
    
    console.log(subcategoriesUrl);

    const seasonsUrl = urlParams.get("seasons")?.split(",") ?? [];

    console.log(seasonsUrl);

    console.log(checkboxes.length);
    
    for(let i = 0; i < checkboxes.length; i++){
        console.log("c");
        
        for(let j = 0; j < subcategoriesUrl.length; j++){
            if(checkboxes[i].value == subcategoriesUrl[j]){
                checkboxes[i].checked = true;
            }   
        }

        for(let j = 0; j < seasonsUrl.length; j++){
            if(checkboxes[i].value == seasonsUrl[j]){
                checkboxes[i].checked = true;
            }
        }
    }
}

async function createSubcategoryOptions(){
    let result = await fetch("https://api.barahol.kz/product/static-info",
    {
        method: "GET",
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
        }
    });

    let data = await result.json();

    console.log(data);

    for(let i = 0; i < data["subcategories"]["clothesCategories"].length; i++){
        createOption($("#subcategory-inner-box"), data["subcategories"]["clothesCategories"][i]);
    }

    for(let i = 0; i < data["subcategories"]["accessoriesCategories"].length; i++){
        createOption($("#subcategory-inner-box"), data["subcategories"]["accessoriesCategories"][i]);
    }

    for(let i = 0; i < data["subcategories"]["shoesCategories"].length; i++){
        createOption($("#subcategory-inner-box"), data["subcategories"]["shoesCategories"][i]);
    }
}

async function createSeasonOptions(){
    let result = await fetch("https://api.barahol.kz/product/static-info",
    {
        method: "GET",
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json;charset=utf-8",
        }
    });

    let data = await result.json();

    console.log(data);

    

    for(let i = 0; i < data["seasons"].length; i++){
        createSeasonOption($("#season-inner-box"), data["seasons"][i], russianSeasons[data["seasons"][i]]);
    }
}

function createOption(parent, value){
    let optionDiv = document.createElement("div");
    optionDiv.classList.add("my-1");

    let optionLabel = document.createElement("label");
    optionLabel.classList.add("tick");
    optionLabel.innerText = value;

    let optionCheckbox = document.createElement("input");
    optionCheckbox.type = "checkbox";
    
    optionCheckbox.value = value;
    optionCheckbox.classList.add("generated");

    checkboxes.push(optionCheckbox);

    optionSpan = document.createElement("span");
    optionSpan.classList.add("check");

    optionDiv.append(optionLabel);
    optionLabel.append(optionCheckbox);
    optionLabel.append(optionSpan);

    parent.append(optionDiv);
}

function createSeasonOption(parent, value, title){
    let optionDiv = document.createElement("div");
    optionDiv.classList.add("my-1");

    let optionLabel = document.createElement("label");
    optionLabel.classList.add("tick");
    optionLabel.innerText = title;

    let optionCheckbox = document.createElement("input");
    optionCheckbox.type = "radio";
    optionCheckbox.setAttribute("radiogroup", "season");
    
    optionCheckbox.value = value;
    optionCheckbox.classList.add("generated");

    optionCheckbox.addEventListener("click", function(){
        
        let other = $("input[type=radio]");
        for(let i =0; i < other.length; i++){
            if(other[i].value != this.value){
                console.log(other[i].value);
                other[i].checked = false;
            }
        }
    });

    checkboxes.push(optionCheckbox);

    optionSpan = document.createElement("span");
    optionSpan.classList.add("check");

    optionDiv.append(optionLabel);
    optionLabel.append(optionCheckbox);
    optionLabel.append(optionSpan);

    parent.append(optionDiv);
}