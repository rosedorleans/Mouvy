const url_base = "https://apis.justwatch.com/content/";
const local = "/fr_FR";
const content_type = null;
const providers = null;
const genres = null;

function find_providers(){
    $.ajax ({
        url: url_base + 'providers/locale' + local,
        type: 'GET',
        success : function(reponse){
            console.log(reponse);
        }
    })
}

function find_genres(){
    $.ajax ({
        url: url_base + 'genres/locale' + local,
        type: 'GET',
        success : function(reponse){
            console.log(reponse);
        }
    })
}

find_genres()
find_providers()