$(document).ready(function(){
    // HIDE LOADING SPINNER WHEN PAGE IS LOADED [7000msec after the page is loaded]
    $(window).on('load', function () {
        setTimeout(function () {
            $('.loader').hide(300);
        }, 2000);
    });



    // FOR DEMO PURPOSE
    $(window).on('load', function () {
        var loadingCounter = setInterval(function () {
            var count = parseInt($('.countdown').html());
            if (count !== 0) {
                $('.countdown').html(count - 1);
            } else {
                clearInterval();
            }
        }, 1000);
    });
    $('#reload').on('click', function (e) {
        e.preventDefault();
        location.reload();
    });
});