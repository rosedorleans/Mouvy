const url_base = "https://www.omdbapi.com/?apikey=72357c68&";


$("#movie_search").on("keypress", function onEvent(event) {
    if (event.key === "Enter") {
        $("#movie_search_btn").click();
    }
});
$("#movie_search_btn").off('click');
$('#movie_search_btn').on('click', function() {
    launchSearch()

});

function launchSearch(){
    $('.spinner').css('display', 'flex');
    $('.movie_result').empty()
    let search = document.querySelector('#movie_search').value
    $.ajax({
        url: url_base + 's=' + search,
        type: 'GET',
        success: function (response) {
            $.each(response, function (key, data) {
                if(key == 'Search'){
                    $.each(data, function (key, value) {
                        let imdbId = value.imdbID
                        $.ajax({
                            url: url_base + 'type=movie&i=' + imdbId,
                            type: 'GET',
                            success: function (response) {
                                $('.movie_result').append(
                                    '<div class="movie_result_box" data-id="'+imdbId+'">'+
                                        '<div>'+
                                            '<h2 class="title open_modal">'+response.Title+'</h2>'+
                                            '<p class="plot">'+response.Plot+'</p>'+
                                            '<p class="genres">'+response.Genre+'</p>'+
                                        '</div>'+
                                        '<div>'+
                                            '<img src="'+response.Poster+'" alt="poster">'+
                                        '</div>'+
                                    '</div>'
                                ).addClass('ajaxComplete')
                                if($('.movie_result').hasClass('ajaxComplete')){
                                    $('.spinner').css('display', 'none');
                                } else {
                                    $('.spinner').css('display', 'none');
                                }
                                $('.movie_result_box').unbind( "click" ).click(function(e){
                                    openDetails($(this).data("id"),e);
                                })
                            }
                        });

                    })
                }
            })
        }
    });
}

function openDetails(imdbId, e){
    $('.popup').removeClass('hidden');
    $('.popup_overlay').removeClass('hidden');
    $("html").css("overflow", 'hidden');
    // console.log($("div[data-id='"+response.imdbID+"']"))
    console.log(imdbId)
    $.ajax({
        url: url_base + 'type=movie&i=' + imdbId,
        type: 'GET',
        success: function (response) {
            console.log(response)
            var runtimeMinutes = response.Runtime.replace(/(^\d+)(.+$)/i,'$1')
            var duration = timeConvert(runtimeMinutes)
            var genres = []
            genres = response.Genre.split(',')
            $.each(genres, function(index, value){
                genres[index] = '<span class="genre '+value+'">'+value+'</span>'
            })
            $('.movie_modal').append(
                '<h2 class="title">'+response.Title+'</h2>' +
                '<img class="poster" src="'+response.Poster+'" alt="poster">' +
                '<p class="plot">"'+response.Plot+'"</p>' +
                '<p class="actors">'+response.Actors+'</p>' +
                '<p class="director">'+response.Director+'</p>' +
                '<p class="year">'+response.Year+'</p>' +
                '<p class="duration">'+duration+'</p>' +
                '<div class="genre_list">'+genres+'</div>' +
                '<div class="ratings"></div>' +
                '<p class="awards">'+response.Awards+'</p>'
            )
            var T_ratings = []
            var rating
            var T_rating = []
            var rating_id = 1
            $.each(response.Ratings, function(index, value){
                $('.ratings').append('<p>'+value.Source+' : <span class="rating rating_'+rating_id+'"><span class="rating_number_'+rating_id+'"></span></span></p>')
                var checked_ratings = checkSpecialChars(value.Value)
                if(checked_ratings.is_percent_char){
                    rating = value.Value.slice(0, -1)
                    $('.rating_number_'+rating_id).text(rating)
                }
                console.log($('.ratings'))
                if(checked_ratings.is_slash_char){
                    T_rating = value.Value.split('/')
                    $('.rating_number_'+rating_id).html(T_rating[0])
                    $('.rating_'+rating_id).html('/'+T_rating[1])
                    if(T_rating[1] == '10'){
                        $('.rating_'+rating_id).addClass('over_ten_rating')
                    }
                    if(T_rating[1] == '100'){
                        $('.rating_'+rating_id).addClass('over_hundred_rating')
                    }
                }
                console.log($('.ratings'))
                rating_id++
            })

            $(".genre_list").html(genres.join(" "));
            $(".ratings").html(T_ratings.join(" "));
            $('.add_to_list').on('click', function() {
                $('.popup_list').removeClass('hidden');
                $('.popup_overlay_list').removeClass('hidden');
                $('.close_list').click(function(){
                    $('.popup_overlay_list').addClass('hidden');
                    $('.popup_list').addClass('hidden');
                    $('.list_modal').empty();
                })
            })
            $('.close').click(function(){
                $("html").css("overflow", 'scroll');
                $('.popup_overlay').addClass('hidden');
                $('.popup').addClass('hidden');
                $('.movie_modal').empty();
            })
        }
    })
    
    
}

function timeConvert(n) {
    var hours = (n / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "h" + rminutes;
}

function checkSpecialChars(text){
    const percent_char = '%'
    const slash_char = '/'
    var is_percent_char = percent_char.split('').some(char => text.includes(char))
    var is_slash_char = slash_char.split('').some(char => text.includes(char))
    return {is_percent_char, is_slash_char};
}















