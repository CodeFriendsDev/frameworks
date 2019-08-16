/**
 * @type {Object}
 */
enchant.ui = enchant.ui || {};
enchant.ui.assets = [
    padImage = "data:image/png;base64,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",
    apadImage = "data:image/png;base64,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",
    icon0Image = "data:image/png;base64,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",
    font0Image = "data:image/png;base64,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"
];
/**
 * @namespace
 */
enchant.Event = enchant.Event || {};

/**
 * 左ボタンタップ時
 */
enchant.Event.INPUT_LEFT = 'inputleft';
enchant.Event.INPUT_RIGHT = 'inputright';
enchant.Event.INPUT_UP = 'inputup';
enchant.Event.INPUT_DOWN = 'inputdown';
/**
 * 方向キーパッドのクラス: Pad
 * @scope enchant.ui.Pad
 */
enchant.ui.Pad = enchant.Class.create(enchant.Sprite, {
    /**
     * 方向キーパッドオブジェクトを作成する。
     * @constructs
     * @extends enchant.Sprite
     */
    initialize: function(width, height) {
        // switching Based
        this.AXIS = {
            AXIS_4_BASED: "axis4",
            AXIS_8_BASED: "axis8"
        };
        this._axisBased = this.AXIS.AXIS_4_BASED;
        var core = enchant.Core.instance;
        var _pad = {};
        _pad.image = core.assets[padImage];
        _pad.width = width || _pad.image.width / 2;
        _pad.height = height || _pad.image.height;
        enchant.Sprite.call(this, _pad.width, _pad.height);
        this.image = _pad.image;
        this.input = { left: false, right: false, up: false, down: false };
        this.addEventListener('touchstart', function(e) {
            this._updateInput(this._detectInput(e.localX, e.localY));
        });
        this.addEventListener('touchmove', function(e) {
            this._updateInput(this._detectInput(e.localX, e.localY));
        });
        this.addEventListener('touchend', function(e) {
            this._updateInput({ left: false, right: false, up: false, down: false });
        });
        this.addEventListener('enterframe', function(e) {
            if (core.input.left) this.dispatchEvent(new Event(Event.INPUT_LEFT));
            if (core.input.right) this.dispatchEvent(new Event(Event.INPUT_RIGHT));
            if (core.input.up) this.dispatchEvent(new Event(Event.INPUT_UP));
            if (core.input.down) this.dispatchEvent(new Event(Event.INPUT_DOWN));
        });
    },
    _detectInput: function(x, y) {
        x -= this.width / 2;
        y -= this.height / 2;
        var input = { left: false, right: false, up: false, down: false };
        if (x * x + y * y > this.width + this.height) {
            if (this._axisBased == this.AXIS.AXIS_4_BASED) {
                if (x < 0 && y * y < x * x) {
                    input.left = true;
                }
                if (x > 0 && y * y < x * x) {
                    input.right = true;
                }
                if (y < 0 && x * x < y * y) {
                    input.up = true;
                }
                if (y > 0 && x * x < y * y) {
                    input.down = true;
                }
            } else if (this._axisBased == this.AXIS.AXIS_8_BASED) {
                if (x < 0 && y < x * x * 0.1 && y > x * x * -0.1) {
                    input.left = true;
                }
                if (x > 0 && y < x * x * 0.1 && y > x * x * -0.1) {
                    input.right = true;
                }
                if (y < 0 && x < y * y * 0.1 && x > y * y * -0.1) {
                    input.up = true;
                }
                if (y > 0 && x < y * y * 0.1 && x > y * y * -0.1) {
                    input.down = true;
                }
            }
        }
        return input;
    },
    _updateInput: function(input) {
        var core = enchant.Core.instance;
        ['left', 'right', 'up', 'down'].forEach(function(type) {
            if (this.input[type] && !input[type]) {
                core.changeButtonState(type, false);
            }
            if (!this.input[type] && input[type]) {
                core.changeButtonState(type, true);
            }
        }, this);
        this.input = input;
    },
    setAxis4Based: function() {
        this._axisBased = this.AXIS.AXIS_4_BASED;
    },
    setAxis8Based: function() {
        this._axisBased = this.AXIS.AXIS_8_BASED;
    }
});
