var Helpers = {
    isToBottom: function ($viewport, $content) {
        return $viewport.height() + $viewport.scrollTop() + 30 > $content.height()
    },

    createNode: function (subject) {
        var $node = $(`<div class="item">
          <a href="#">
            <div class="cover">
              <img src="" alt="">
            </div>
            <div class="detail">
              <h2></h2>
              <div class="extra"><span class="score"></span> / <span class="collection"></span>收藏</div>
              <div class="extra"></div>
              <div class="extra"></div>
              <div class="extra"></div>
            </div>
          </a>
        </div>`)
        $node.find('a').attr('href', subject.alt)
        $node.find('.cover img').attr('src', subject.images.small)
        $node.find('.detail h2').text(subject.title)
        $node.find('.detail .score').text(subject.rating.average)
        $node.find('.detail .collection').text(subject.collect_count)
        $node.find('.detail .extra').eq(0).text(subject.year + ' / ' + subject.genres.join('、'))
        $node.find('.detail .extra').eq(1).text('导演：' + subject.directors.map(v => v.name).join('、'))
        $node.find('.detail .extra').eq(2).text('主演：' + subject.casts.map(v => v.name).join('、'))
        //console.log(_this.$container)
        return $node
    }
}


/* 底部tab切换 */
var Paging = {
    init: function () {
        this.$tabs = $('footer>div')
        this.$pages = $('main>section')
        this.bind()
    },
    bind: function () {
        var _this = this
        this.$tabs.on('click', function () {
            var $this = $(this)
            var index = $this.index()
            $this.addClass('active')
                .siblings().removeClass('active')
            _this.$pages.eq(index).fadeIn().siblings().fadeOut()
        })
    }
}

/* top250 */
var Top250 = {
    init: function () {
        var _this = this
        this.$container = $('#top250')
        this.$content = this.$container.find('.container')
        this.page = 0
        this.count = 10
        this.isFinshed = false
        this.isLoading = false
        this.bind()
        this.getData(function (data) {
            _this.renderData(data)
            _this.page++
        })
    },
    bind: function () {
        var _this = this

        this.$container.on('scroll', function () {
            console.log(_this.isLoading)
            if (Helpers.isToBottom(_this.$container, _this.$content) && !_this.isFinshed && !_this.isLoading) {
                console.log('to bottom')
                _this.getData(function (data) {
                    _this.renderData(data)
                    _this.page++
                        if (_this.page * _this.count > data.total) {
                            _this.isFinshed = true
                        }
                })
            }
            // if(_this.clock){
            //   clearTimeout(_this.clock)
            // }
            // _this.clock = setTimeout(function(){
            //   console.log('scroll...')

            // }, 100)
        })
    },
    getData: function (callback) {
        var _this = this
        this.isLoading = true
        this.$container.find('.loading').show(400)
        $.ajax({
            url: '//api.douban.com/v2/movie/top250',
            data: {
                start: this.count * this.page,
                count: this.count
            },
            dataType: 'jsonp'
        }).done(function (ret) {
            _this.isLoading = false
            _this.$container.find('.loading').hide(400)
            callback(ret)
        })
    },
    renderData(data) {
        var _this = this
        data.subjects.forEach(function (item) {
            var $node = Helpers.createNode(item)
            _this.$content.append($node)
        })
    }

}