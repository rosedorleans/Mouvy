const url_base = "https://www.omdbapi.com/?apikey=72357c68&";

$("#movie_search_btn").off('click');
$('#movie_search_btn').on('click', function() {
    $('.movie-result').empty()
    let search = document.querySelector('#movie_search').value
    $.ajax({
        url: url_base + 't=' + search,
        type: 'GET',
        success: function (response) {
            console.log(response)
            $('.movie-result').append(
                '<div class="movie-result-box">' +
                    '<h2 class="title open-modal">'+response.Title+'</h2>' +
                    '<p class="plot">'+response.Plot+'</p>' +
                    '<p class="genres">'+response.Genre+'</p>' +
                '</div>'
            )
            $('.movie-result-box').on('click', function() {
                $('.popup').removeClass('hidden');
                $('.popup-overlay').removeClass('hidden');
                $("html").css("overflow", 'hidden');
                let runtimeMinutes = response.Runtime.replace(/(^\d+)(.+$)/i,'$1')
                let duration = timeConvert(runtimeMinutes)
                let genres = []
                console.log(response.Genre)
                genres = response.Genre.split(', ')
                console.log((genres))
                $.each(genres, function(index, value){
                    genres[index] = '<span>'+value+'</span>'
                })
                console.log(genres)
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
            })
        }
    });

});

function timeConvert(n) {
    let hours = (n / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    return rhours + "h" + rminutes;
}















