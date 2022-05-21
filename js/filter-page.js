// For Filters
var count = 0, count2 = 0;
var collapsed = true;
document.addEventListener("DOMContentLoaded", function() {
    var filterBtn = document.getElementById('filter-btn');
    var btnTxt = document.getElementById('btn-txt');
    var filterAngle = document.getElementById('filter-angle');
    
    btnTxt.addEventListener("click", function(){    
        if(!collapsed){
            $('#filterbar').collapse(true);
            
        }
        else {
            $('#filterbar').collapse(false);
            
        }
        console.log(collapsed);
    });
    
    // For Applying Filters
    $('#inner-box').collapse(false);
    $('#inner-box2').collapse(false);
    
    // For changing NavBar-Toggler-Icon
    var icon = document.getElementById('icon');


    var inputLeft = document.getElementById("input-left");
    var inputRight = document.getElementById("input-right");

    inputLeft.value = 0;
    inputRight.value = 90000;
    
    var thumbLeft = document.querySelector(".slider > .thumb.left");
    var thumbRight = document.querySelector(".slider > .thumb.right");
    var range = document.querySelector(".slider > .range");
    
    var amountLeft = document.getElementById('amount-left')
    var amountRight = document.getElementById('amount-right')
    
    setLeftValue();
    setRightValue();
    
    inputLeft.addEventListener("input", setLeftValue);
    inputRight.addEventListener("input", setRightValue);
    
    inputLeft.addEventListener("mouseover", function () {
        thumbLeft.classList.add("hover");
    });
    inputLeft.addEventListener("mouseout", function () {
        thumbLeft.classList.remove("hover");
    });
    inputLeft.addEventListener("mousedown", function () {
        thumbLeft.classList.add("active");
    });
    inputLeft.addEventListener("mouseup", function () {
        thumbLeft.classList.remove("active");
    });
    
    inputRight.addEventListener("mouseover", function () {
        thumbRight.classList.add("hover");
    });
    inputRight.addEventListener("mouseout", function () {
        thumbRight.classList.remove("hover");
    });
    inputRight.addEventListener("mousedown", function () {
        thumbRight.classList.add("active");
    });
    inputRight.addEventListener("mouseup", function () {
        thumbRight.classList.remove("active");
    });    



    $('.plus_button').click(function(){
        if(this.innerText == "+"){
            this.innerText = "-";
        }
        else{
            this.innerText = "+";
        }
    })
});

function setLeftValue() {
    let thumbLeft = document.querySelector(".slider > .thumb.left");
    let thumbRight = document.querySelector(".slider > .thumb.right");
    let range = document.querySelector(".slider > .range");
    let inputLeft = document.getElementById("input-left");
    let inputRight = document.getElementById("input-right");
    let amountLeft = document.getElementById('amount-left');
    let amountRight = document.getElementById('amount-right');
    var _this = inputLeft;
    min = parseInt(_this.min),
    max = parseInt(_this.max);
    
    _this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);
    
    var percent = ((_this.value - min) / (max - min)) * 100;
    
    thumbLeft.style.left = percent + "%";
    range.style.left = percent + "%";
    amountLeft.innerText = parseInt(_this.value);
}

function setRightValue() {
    let thumbLeft = document.querySelector(".slider > .thumb.left");
    let thumbRight = document.querySelector(".slider > .thumb.right");
    let range = document.querySelector(".slider > .range");
    let inputLeft = document.getElementById("input-left");
    let inputRight = document.getElementById("input-right");
    let amountLeft = document.getElementById('amount-left');
    let amountRight = document.getElementById('amount-right');
    var _this = inputRight,
    min = parseInt(_this.min),
    max = parseInt(_this.max);
    
    _this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);
    
    var percent = ((_this.value - min) / (max - min)) * 100;
    
    amountRight.innerText = parseInt(_this.value);
    thumbRight.style.right = (100 - percent) + "%";
    range.style.right = (100 - percent) + "%";
}