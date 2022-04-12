var urlParams;
var checkboxes = [];
var products;

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

        window.location.replace("/pages/filter-page.html?" + params);
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
            finalParams += "&category=" + genderUrl[i];

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

    createSubcategoryOptions().then(createSeasonOptions).then(checkOptions);

    loadProducts(finalParams);



});

async function loadProducts(params){
    console.log("loading products...\n" + params);
    let result = await fetch("https://api.barahol.kz/product/filter?" + params, {method: "GET"});
    
    let products = await result.json();
    console.log(products);

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

            row.appendChild(div1);

            let div2 = document.createElement("div");
            div2.classList.add("single-product");
            div2.id = products[j]["productId"];

            div2.addEventListener('click', function(){
                window.location.replace('/pages/product-page.html?id=' + this.id);
            })

            div1.appendChild(div2);

            let first_part = document.createElement("div");
            first_part.classList.add("part-1");
            first_part.style = "background: url('https://barahol.kz/ProductImages/" + products[j]["productImages"][0]['imageSource'] + "') no-repeat center; background-size: contain ;";
            
            div2.appendChild(first_part);

            let second = document.createElement("div");
            second.classList.add("part-2");

            div2.appendChild(second);

            let title = document.createElement("h3");
            title.textContent = products[j]['name'];
            title.classList.add("product-title");

            let old_price = document.createElement("h4");
            old_price.textContent =  products[j]['salesPrice'] + "₸";
            old_price.classList.add("product-old-price");

            let price = document.createElement("h4");
            price.textContent = products[j]['price'] + "₸";
            price.classList.add("product-price");

            second.appendChild(title);
            second.appendChild(old_price);
            second.appendChild(price);
        }
        $("#products-super-container").append(row);
}

function checkOptions(){
    

    const subcategoriesUrl = urlParams.get("subcategories").split(",");
    
    console.log(subcategoriesUrl);

    const seasonsUrl = urlParams.get("seasons").split(",");

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
        createOption($("#season-inner-box"), data["seasons"][i]);
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