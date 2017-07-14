enchant.Event = enchant.Event || {};
enchant.Event.GAMEPAD_LEFT = 'gamepadleft';
enchant.Event.GAMEPAD_RIGHT = 'gamepadright';
enchant.Event.GAMEPAD_UP = 'gamepadup';
enchant.Event.GAMEPAD_DOWN = 'gamepaddown';
enchant.GamePad = enchant.Class.create(enchant.EventTarget, {
    initialize: function() {
        var core = enchant.Core.instance;
        enchant.EventTarget.call(this);
        this.addEventListener(Event.ENTER_FRAME, function(e) {
            var gamepad_list = navigator.getGamepads();
            for(i=0;i < gamepad_list.length;i++){
                // ゲームパッドを取得する（undefined 値の場合もある）
                var gamepad = gamepad_list[i];
                if(!gamepad) continue;
                var buttons = gamepad.buttons;
                var n = buttons.length;
                for(j=0;j < n;j++){
                    // GamepadButton オブジェクトを取得
                    var button = buttons[j];
                    // ボタン入力強度
                    if (button.pressed) {
                        // UP
                        if (j==12) {
                            e = new Event("gamepadup");
                            this.dispatchEvent(e);
                        }
                        // DOWN
                        if (j==13) {
                          e = new Event("gamepaddown");
                          this.dispatchEvent(e);                        
                        }
                        // LEFT
                        if (j==14) {
                          e = new Event("gamepadleft");
                          this.dispatchEvent(e);                        
                        }
                        // RIGHT
                        if (j==15) {
                          e = new Event("gamepadright");
                          this.dispatchEvent(e);                        
                        }
                    }
                }
            }
        });
    }
});
