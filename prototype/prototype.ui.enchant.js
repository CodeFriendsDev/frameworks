/**
 * @type {Object}
 */
enchant.ui = enchant.ui || {};
enchant.ui.assets = [];
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
        enchant.Sprite.call(this, width, height);
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
