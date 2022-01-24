const url_base = "https://www.omdbapi.com/?apikey=72357c68&";

$("#movie_search_btn").off('click');
$('#movie_search_btn').on('click', function() {
    let val = document.querySelector('#movie_search').value;
    console.log(val);
    $.ajax({
        url: url_base + 't=' + val,
        type: 'GET',
        success: function (response) {
            console.log(response)
            $('.popup').removeClass('hidden');
            $('.popup-overlay').removeClass('hidden');
            $("html").css("overflow", 'hidden');
            $("#movie_page").append('' +
                '<p>'+response.Title+'</p>' +
                '<p></p>')
        }
    });
    $('.close').click(function(){
        $("html").css("overflow", 'scroll');
        $('.popup-overlay').addClass('hidden');
        $('.popup').addClass('hidden');
        $('#movie_page').empty();
    })
});













