enchant.widget = enchant.widget || {};
enchant.widget.assets = [];

enchant.widget._env.FLINGVEL = 1;

enchant.widget._env.color = 'black';

enchant.widget.parseContent = function (content, font, color) {
    var en, metrics;
    if (typeof content === 'undefined') {
        content = '';
    }
    if (typeof content === 'number') {
        content = '' + content;
    }
    if (content instanceof enchant.Entity) {
    } else if (content instanceof enchant.Surface) {
        en = new enchant.Sprite(content.width, content.height);
        en.image = content;
        content = en;
    } else if (typeof content == 'string') {
        en = new enchant.Label(content);
        if (font) {
            en.font = font;
        } else {
            en.font = enchant.widget._env.font;
        }
        if (color) {
            en.color = color;
        } else {
            en.color = enchant.widget._env.color;
        }
        metrics = en.getMetrics();
        en.width = metrics.width;
        en.height = metrics.height;
        content = en;
    }
    return content;
}

var NOTOUCH = 0;
var WAITDBL = 1;
var NOMOVE = 2;
var NOMOVEDBL = 3;
var MOVED = 4;
var HOLD = 5;
enchant.widget.GestureDetector.prototype.ontouchend = function(e) {
    var core = enchant.Core.instance;
    switch (this._state) {
        case MOVED:
            velocityX = (this._lastX - this._startX) / this._velobase / this._touchElapsed * 1000;
            velocityY = (this._lastY - this._startY) / this._velobase / this._touchElapsed * 1000;
            if (Math.abs(velocityX) > enchant.widget._env.FLINGVEL || Math.abs(velocityY) > enchant.widget._env.FLINGVEL) {
                var evt = new enchant.Event(enchant.Event.FLING);
                evt.x = this._startX;
                evt.y = this._startY;
                evt.ex = this._lastX;
                evt.ey = this._lastY;
                evt.velocityX = velocityX;
                evt.velocityY = velocityY;
                this._target.dispatchEvent(evt);
            }
            this._state = NOTOUCH;
            break;
        case HOLD:
            var evt = new enchant.Event(enchant.Event.RELEASE);
            evt.x = this._lastX;
            evt.y = this._lastY;
            this._target.dispatchEvent(evt);
            this._state = NOTOUCH;
            break;
        case NOMOVEDBL:
            var evt = new enchant.Event(enchant.Event.DOUBLETAP);
            evt.x = this._lastX;
            evt.y = this._lastY;
            this._target.dispatchEvent(evt);
            this._state = NOTOUCH;
            this._releaseElapsed = 0;
            break;
        case NOMOVE:
            this._state = WAITDBL;
            break;
        default:
            this._state = NOTOUCH;
            break;
    }
    this._touchElapsed = 0;
    this._startX = 0;
    this._startY = 0;
}