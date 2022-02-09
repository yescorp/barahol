$(document).ready(function(){
    $("#product_type").change(function(){
        if($(this).val() == 'clothes'){
            $("#shoes_material").hide();
            $("#clothes_material").show();
        }
        else{
            $("#shoes_material").show();
            $("#clothes_material").hide();
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