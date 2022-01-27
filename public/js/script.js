const url_base = "https://www.omdbapi.com/?apikey=72357c68&";

$("#movie_search_btn").off('click');
$('#movie_search_btn').on('click', function() {
    $('.movie-result').empty()
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
                            url: url_base + 'i=' + imdbId,
                            type: 'GET',
                            success: function (response) {
                                $('.movie-result').append(
                                    '<div class="movie-result-box" data-id="'+imdbId+'">' +
                                    '<h2 class="title open-modal">' + response.Title + '</h2>' +
                                    '<p class="plot">' + response.Plot + '</p>' +
                                    '<p class="genres">' + response.Genre + '</p>' +
                                    '</div>'
                                )
                                $('.movie-result-box').unbind( "click" ).click(function(e){
                                    openDetails($(this),e, response);
                                })
                                // $('.movie-result-box').on('click', function() {
                                //
                                // })
                            }
                        })

                    })
                }
            })
        }
    });

});

function openDetails(elem, e, response){
    $('.popup').removeClass('hidden');
    $('.popup-overlay').removeClass('hidden');
    $("html").css("overflow", 'hidden');
    console.log($("div[data-id='"+response.imdbID+"']"))
    console.log(response)
    if(elem.data("id") == response.imdbID) {
        console.log(elem)
        let runtimeMinutes = response.Runtime.replace(/(^\d+)(.+$)/i,'$1')
        let duration = timeConvert(runtimeMinutes)
        let genres = []
        genres = response.Genre.split(', ')
        $.each(genres, function(index, value){
            genres[index] = '<span>'+value+'</span>'
        })
        let ratings = []
        $.each(response.Ratings, function(index, value){
            ratings.push('<p>'+value.Source +' : '+value.Value+'</p>')
        })
        $('.movie-modal').append(
            '<h2 class="title">'+response.Title+'</h2>' +
            '<img class="poster" src="'+response.Poster+'" alt="poster">' +
            '<p class="plot">"'+response.Plot+'"</p>' +
            '<p class="actors">'+response.Actors+'</p>' +
            '<p class="director">'+response.Director+'</p>' +
            '<p class="year">'+response.Year+'</p>' +
            '<p class="duration">'+duration+'</p>' +
            '<div class="genres">'+genres+'</div>' +
            '<div class="ratings"></div>' +
            '<p class="awards">'+response.Awards+'</p>'
        )
        $(".genres").html(genres.join(" "));
        $(".ratings").html(ratings.join(" "));
        $('.add-to-list').on('click', function() {
            $('.popup-list').removeClass('hidden');
            $('.popup-overlay-list').removeClass('hidden');
            $('.close-list').click(function(){
                $('.popup-overlay-list').addClass('hidden');
                $('.popup-list').addClass('hidden');
                $('.list-modal').empty();
            })
        })
        $('.close').click(function(){
            $("html").css("overflow", 'scroll');
            $('.popup-overlay').addClass('hidden');
            $('.popup').addClass('hidden');
            $('.movie-modal').empty();
        })
    }
}

function timeConvert(n) {
    let hours = (n / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    return rhours + "h" + rminutes;
}















