$(document).ready(function(){
    $("#product_type").change(function(){
        if($(this).val() == 'clothes'){
            $("#shoes_material").hide();
            $("#clothes_material").show();
            $("#product_pattern_label").show();
            $("#product_pattern").show();
        }
        else{
            $("#shoes_material").show();
            $("#clothes_material").hide();
            $("#product_pattern_label").hide();
            $("#product_pattern").hide();
        }
    });

    $("#category_gender").change(function(){

        if($(this).val() == 'male'){
            $("#subcategory_male").show();
            $("#subcategory_female").hide();
            $("#subcategory_kids").hide();
            $("#subcategory_multisex").hide();
            
        }
        else if($(this).val() == 'female'){
            $("#subcategory_male").hide();
            $("#subcategory_female").show();
            $("#subcategory_kids").hide();
            $("#subcategory_multisex").hide();
        }
        else if($(this).val() == 'kids'){
            $("#subcategory_male").hide();
            $("#subcategory_female").hide();
            $("#subcategory_kids").show();
            $("#subcategory_multisex").hide();
        }
        else if($(this).val() == 'multisex'){
            $("#subcategory_male").hide();
            $("#subcategory_female").hide();
            $("#subcategory_kids").hide();
            $("#subcategory_multisex").show();
        }
    });
});

var materialCount = 2;

function addMaterial(){
    let sel = document.createElement("select");
    sel.id = "clothes_material" + materialCount;
    
    let opt = document.createElement("option");
    opt.value = "value";
    opt.text = "text";

    sel.append(opt);

    var inp = document.createElement("input");
    inp.type = "number";
    inp.id = "clothes_material_percent" + materialCount;
    inp.placeholder = "процентов";

    $("#clothes_material").append(sel);
    
    $("#clothes_material").append(inp);
    console.log(materialCount);
    materialCount++;
}

function removeLastMaterial(){
    materialCount--;
    if(materialCount == 1){
        materialCount++;
        return;
    }
    $("input").remove("#clothes_material_percent" + materialCount);
    $("select").remove("#clothes_material" + materialCount);
    
    console.log(materialCount);
}
