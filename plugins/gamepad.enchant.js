enchant.Event = enchant.Event || {};
enchant.Event.GAMEPAD_A = 'gamepadA';
enchant.Event.GAMEPAD_B = 'gamepadB';
enchant.Event.GAMEPAD_X = 'gamepadX';
enchant.Event.GAMEPAD_Y = 'gamepadY';
enchant.Event.GAMEPAD_LEFT = 'gamepadleft';
enchant.Event.GAMEPAD_RIGHT = 'gamepadright';
enchant.Event.GAMEPAD_UP = 'gamepadup';
enchant.Event.GAMEPAD_DOWN = 'gamepaddown';
enchant.GamePad = enchant.Class.create(enchant.EventTarget, {
    initialize: function(playerId) {
        var core = enchant.Core.instance;
        enchant.EventTarget.call(this);
        this.addEventListener(Event.ENTER_FRAME, function(e) {
            var gamepad_list = navigator.getGamepads();
            for(i=0;i < gamepad_list.length;i++){
                // playerId指定の場合はそのidのみ取得
                if (playerId) if (playerId != i) continue;
                // ゲームパッドを取得する（undefined 値の場合もある）
                var gamepad = gamepad_list[i];
                if(!gamepad) continue;
                var mapping = gamepad.mapping;
                var buttons = gamepad.buttons;
                var n = buttons.length;
                for(j=0;j < n;j++){
                    // GamepadButton オブジェクトを取得
                    var button = buttons[j];
                    // ボタン入力強度
                    if (button.pressed) {
                        e = new Event();
                        e.buttons = {};
                        e.buttons.pressed = button.pressed;
                        e.buttons.value = button.value;
                        // A
                        if (j==1) {
                            e.type = "gamepadA";
                        }
                        // B
                        if (j==0) {
                            e.type = "gamepadB";
                        }
                        // X
                        if (j==3) {
                            e.type = "gamepadX";
                        }
                        // Y
                        if (j==2) {
                            e.type = "gamepadY";
                        }
                        // UP
                        if (j==12) {
                            e.type = "gamepadup";
                        }
                        // DOWN
                        if (j==13) {
                            e.type = "gamepaddown";
                        }
                        // LEFT
                        if (j==14) {
                            e.type = "gamepadleft";
                        }
                        // RIGHT
                        if (j==15) {
                            e.type = "gamepadright";
                        }
                        this.dispatchEvent(e);
                    }
                }
            }
        });
    }
});
