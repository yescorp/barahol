$(document).ready(function(){

    $("#apply_filters").click(function(){
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
        }

        if($("#accessories").is(":checked")){
            if(count > 0) {
                params += "&";
            }
            params += "accessories=true";
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

    createSubcategoryOptions();
    createSeasonOptions();


    const queryString = window.location.search;
    console.log(queryString);

    const urlParams = new URLSearchParams(queryString);

    const clothesUrl = urlParams.get("clothes");
    const shoesUrl = urlParams.get("shoes");
    const accessoryUrl = urlParams.get("accessories");

    const subcategoriesUrl = urlParams.get("subcategories").split(",");

    const seasonsUrl = urlParams.get("seasons").split(",");

    const startPriceUrl = parseInt(urlParams.get("startPrice"));

    const endPrice = parseInt(urlParams.get("endPrice"));

    
   
});

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

    optionSpan = document.createElement("span");
    optionSpan.classList.add("check");

    optionDiv.append(optionLabel);
    optionLabel.append(optionCheckbox);
    optionLabel.append(optionSpan);

    parent.append(optionDiv);
}