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
                    var response_id = 1
                    $.each(data, function (key, value) {
                        let imdbId = value.imdbID
                        if(value.Type == "movie"){
                            $.ajax({
                                url: url_base + 'type=movie&i=' + imdbId,
                                type: 'GET',
                                success: function (response) {
                                    $('.movie_result').append(
                                        '<div class="movie_result_box" data-id="'+imdbId+'">'+
                                            '<div>'+
                                                '<h2 class="title open_modal">'+response.Title+'</h2>'+
                                                '<p class="plot">'+response.Plot+'</p>'+
                                                '<p class="genres"></p>'+
                                            '</div>'+
                                            '<div>'+
                                                '<img src="'+response.Poster+'" alt="poster">'+
                                            '</div>'+
                                        '</div>'
                                    ).addClass('ajaxComplete')
                                    var genres = []
                                    var html_genres = []
                                    changeGenreColor(response, genres, html_genres)
                                    $.each(html_genres, function(index, value){
                                        $('[data-id='+imdbId+'] .genres').append(value)
                                    })
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
                        }
                        response_id++
                    })
                }
            })
        },
        error: function (response) {
            console.log(response)
            $('.spinner').css('display', 'none')
            $('#error_message').css('display', 'block')
        }
    });
}

function openDetails(imdbId, e){
    $('.popup').removeClass('hidden');
    $('.popup_overlay').removeClass('hidden');
    $("html").css("overflow", 'hidden');
    // console.log($("div[data-id='"+response.imdbID+"']"))
    $.ajax({
        url: url_base + 'type=movie&i=' + imdbId,
        type: 'GET',
        success: function (response) {
            console.log(response)
            var runtimeMinutes = response.Runtime.replace(/(^\d+)(.+$)/i,'$1')
            var duration = timeConvert(runtimeMinutes)
            var modal_genres = []
            var html_genres = []
            changeGenreColor(response, modal_genres, html_genres)
            $('.movie_modal').append(
                '<h2 class="title">'+response.Title+'</h2>' +
                '<img class="poster" src="'+response.Poster+'" alt="poster">' +
                '<p class="plot">Résumé : <span>"'+response.Plot+'"</span></p>' +
                '<p class="actors">Avec <span>'+response.Actors+'</span></p>' +
                '<p class="director">De <span>'+response.Director+'</span></p>' +
                '<p class="year">Année : <span>'+response.Year+'</span></p>' +
                '<p class="duration">Durée : <span>'+duration+'</span></p>' +
                '<div class="ratings"></div>' +
                '<div class="genre_list"></div>' +
                '<p class="awards">Récompenses : <span>'+response.Awards+'</span></p>'
            )
            $.each(html_genres, function(index, value){
                $('.genre_list').append(value)
            })
            var T_ratings = []
            var rating
            var T_rating = []
            var rating_id = 1
            $.each(response.Ratings, function(index, value){
                $('.ratings').append(
                    '<p>'+value.Source+' : '+
                        '<span class="rating rating_'+rating_id+'">'+
                            '<span class="rating_number_'+rating_id+'"></span>'+
                            '<span class="rating_over_'+rating_id+'"></span>'+
                        '</span>'+
                    '</p>')
                var checked_ratings = checkSpecialChars(value.Value)
                if(checked_ratings.is_percent_char){
                    rating = value.Value.slice(0, -1)
                    $('.rating_number_'+rating_id).text(rating)
                    $('.rating_over_'+rating_id).text("%").addClass('over_hundred_rating')
                    changeRatingColor(rating, 40, 70, ".rating_"+rating_id)
                }
                if(checked_ratings.is_slash_char){
                    T_rating = value.Value.split('/')
                    $('.rating_number_'+rating_id).text(T_rating[0])
                    $('.rating_over_'+rating_id).text('/'+T_rating[1])
                    if(T_rating[1] == '10'){
                        $('.rating_over_'+rating_id).addClass('over_ten_rating')
                        changeRatingColor(T_rating[0], 4, 7, ".rating_"+rating_id)
                    }
                    if(T_rating[1] == '100'){
                        $('.rating_over'+rating_id).addClass('over_hundred_rating')
                        changeRatingColor(T_rating[0], 4, 70, ".rating_"+rating_id)
                    }
                }
                rating_id++
            })

            // $(".ratings").html(T_ratings.join(" "));
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

function changeRatingColor(rating, low, middle, selector){
    if (rating <= low) {
        $(selector).addClass('red_rating')
    } else if (rating <= middle) {
        $(selector).addClass('orange_rating')
    } else if (rating > middle){
        $(selector).addClass('green_rating')
    }
}

function changeGenreColor(response, genres, html_genres){
    genres = response.Genre.split(',')
    $.each(genres, function(index, value){
        value = value.replace(/ /g, '');
        switch(value){
            case "Comedy":
                html_genres[index] = '<span class="genre comedy_genre '+value+'">'+value+'</span>';
                break;
            case "Romance":
                html_genres[index] = '<span class="genre romance_genre '+value+'">'+value+'</span>';
                break;
            case "Drama":
                html_genres[index] = '<span class="genre drama_genre '+value+'">'+value+'</span>';
                break;
            case "Western":
                html_genres[index] = '<span class="genre western_genre '+value+'">'+value+'</span>';
                break;
            case "History":
                html_genres[index] = '<span class="genre history_genre '+value+'">'+value+'</span>';
                break;
            case "Thriller":
                html_genres[index] = '<span class="genre thriller_genre '+value+'">'+value+'</span>';
                break;
            case "Crime":
                html_genres[index] = '<span class="genre crime_genre '+value+'">'+value+'</span>';
                break;
            case "Mystery":
                html_genres[index] = '<span class="genre mystery_genre '+value+'">'+value+'</span>';
                break;
            case "Horror":
                html_genres[index] = '<span class="genre horror_genre '+value+'">'+value+'</span>';
                break;
            case "War":
                html_genres[index] = '<span class="genre war_genre '+value+'">'+value+'</span>';
                break;
            case "Music":
                html_genres[index] = '<span class="genre music_genre '+value+'">'+value+'</span>';
                break;
            case "Fantasy":
                html_genres[index] = '<span class="genre fantasy_genre '+value+'">'+value+'</span>';
                break;
            case "Adventure":
                html_genres[index] = '<span class="genre adventure_genre '+value+'">'+value+'</span>';
                break;
            case "Action":
                html_genres[index] = '<span class="genre action_genre '+value+'">'+value+'</span>';
                break;
            case "Animation":
                html_genres[index] = '<span class="genre animation_genre '+value+'">'+value+'</span>';
                break;
            case "Biography":
                html_genres[index] = '<span class="genre biography_genre '+value+'">'+value+'</span>';
                break;
            case "Documentary":
                html_genres[index] = '<span class="genre documentary_genre '+value+'">'+value+'</span>';
                break;
        }
    })
    return html_genres
}















