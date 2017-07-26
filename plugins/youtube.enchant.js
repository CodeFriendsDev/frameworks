enchant.youtube = enchant.youtube || {};

(function(window, undefined) {

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

}(window));


enchant.youtube.YouTube = enchant.Class.create(enchant.EventTarget, {
    initialize: function(appendTag, createTag, path, option) {
        enchant.EventTarget.call(this);
        var _id = path;
        this.path = path;
        this.option = option || {height: 0, width: 0, auto: false};
        this._player;
        this._playerReady = false;
        this._playerState = null;
        this._stack = null;
        var _this = this;

        var element = document.createElement(element); 
        element.id = _id; 
        var objBody = document.getElementsByTagName(appendTag).item(0); 
        objBody.appendChild(element);

        this._player = new YT.Player(this.path, {
            height: _this.option.height.toString(),
            width: _this.option.width.toString(),
            videoId: this.path,
            events: {
               'onReady': onPlayerReady,
               'onStateChange': onPlayerStateChange
            }
        });
        function onPlayerReady(e) {
            _this._playerReady = true;
            if (_this._stack != null) {
                _this._stack();
            } else if (_this.option.auto) {
                e.target.playVideo();
            }
            _this._stack = null;
        }
        function onPlayerStateChange(e) {
            if (event.data == YT.PlayerState.UNSTARTED) {
            }
            if (event.data == YT.PlayerState.ENDED) {
            }
            if (event.data == YT.PlayerState.PLAYING) {
            }
            if (event.data == YT.PlayerState.PAUSED) {
            }
            if (event.data == YT.PlayerState.BUFFERING) {
            }
         }
    },
    play: function() {
        if (this._playerReady != true) {
            this._stack = this.play;
        } else if (this._playerState != YT.PlayerState.PLAYING) {
            this._player.playVideo();
        }
    },
});
