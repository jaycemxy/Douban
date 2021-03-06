$('footer>div').click(function () {
    let $index = $(this).index()
    $('section').hide().eq($index).fadeIn()
    $(this).addClass('active').siblings().removeClass('active')
}).eq(0).click()


var index = 0
getData()
var isLoading = false

function getData() {
    if(isLoading) return
    isLoading = true
    $('.loading').show()
    $.ajax({
        url: 'https://api.douban.com/v2/movie/top250',
        type: 'GET',
        data: {
            start: index,
            count: 20
        },
        dataType: 'jsonp'
    }).done(function (ret) {
        console.log(ret)
        setData(ret)
        index += 20
    }).fail(function () {
        console.log('error...')
    }).always(function(){
        isLoading = false
        $('.loading').hide()
    })
}

$('main').scroll(function () {
    if ($('section').eq(0).height() - 10 <= $('main').scrollTop() + $('main').height()) {
        getData()
    }
})

function setData(data) {
    data.subjects.forEach(function (movie) {
        var template = `
          <div class="item">
            <a href="#">
              <div class="cover">
                <img src="" alt="">
              </div>
              <div class="detail">
                <h2></h2>
                <div class="extra"><span class="score"></span>分 / <span class="collect"></span>收藏</div>
                <div class="extra"><span class="year"></span> / <span class="type"></span></div>
                <div class="extra">导演：<span class="director"></span></div>
                <div class="extra">主演：<span class="actor"></span></div>
              </div>
            </a>
          </div>`

        var $node = $(template)
        $node.find('.cover img').attr('src', movie.images.medium)
        $node.find('.detail h2').text(movie.title)
        $node.find('.score').text(movie.rating.average)
        $node.find('.collect').text(movie.collect_count)
        $node.find('.year').text(movie.year)
        $node.find('.type').text(movie.genres.join(' / '))
        $node.find('.director').text(function () {
            var directorsArr = []
            movie.directors.forEach(function (item) {
                directorsArr.push(item.name)
            })
            return directorsArr.join('、')
        })
        $node.find('.actor').text(function () {
            var actorArr = []
            movie.casts.forEach(function (item) {
                actorArr.push(item.name)
            })
            return actorArr.join('、')
        })

        $('#top250').append($node)
    })
}