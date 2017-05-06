enchant.widget = enchant.widget || {};
enchant.widget.assets = [];

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