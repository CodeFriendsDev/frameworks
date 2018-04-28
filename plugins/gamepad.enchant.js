enchant.Event = enchant.Event || {};
enchant.Event.GAMEPAD = 'gamepad';
// A
enchant.Event.GAMEPAD_A = 'gamepadA';
enchant.Event.GAMEPAD_A_UP = 'gamepadAup';
enchant.Event.GAMEPAD_A_DOWN = 'gamepadAdown';
enchant.Event.GAMEPAD_A_TICK = 'gamepadAtick';
// B
enchant.Event.GAMEPAD_B = 'gamepadB';
enchant.Event.GAMEPAD_B_UP = 'gamepadBup';
enchant.Event.GAMEPAD_B_DOWN = 'gamepadBdown';
enchant.Event.GAMEPAD_B_TICK = 'gamepadBtick';
// X
enchant.Event.GAMEPAD_X = 'gamepadX';
enchant.Event.GAMEPAD_X_UP = 'gamepadXup';
enchant.Event.GAMEPAD_X_DOWN = 'gamepadXdown';
enchant.Event.GAMEPAD_X_TICK = 'gamepadXtick';
// Y
enchant.Event.GAMEPAD_Y = 'gamepadY';
enchant.Event.GAMEPAD_Y_UP = 'gamepadYup';
enchant.Event.GAMEPAD_Y_DOWN = 'gamepadYdown';
enchant.Event.GAMEPAD_Y_TICK = 'gamepadYtick';
// L1
enchant.Event.GAMEPAD_L1 = 'gamepadL1';
enchant.Event.GAMEPAD_L1_UP = 'gamepadL1up';
enchant.Event.GAMEPAD_L1_DOWN = 'gamepadL1down';
enchant.Event.GAMEPAD_L1_TICK = 'gamepadL1tick';
// R1
enchant.Event.GAMEPAD_R1 = 'gamepadR1';
enchant.Event.GAMEPAD_R1_UP = 'gamepadR1up';
enchant.Event.GAMEPAD_R1_DOWN = 'gamepadR1down';
enchant.Event.GAMEPAD_R1_TICK = 'gamepadR1tick';
// L2
enchant.Event.GAMEPAD_L2 = 'gamepadL2';
enchant.Event.GAMEPAD_L2_UP = 'gamepadL2up';
enchant.Event.GAMEPAD_L2_DOWN = 'gamepadL2down';
enchant.Event.GAMEPAD_L2_TICK = 'gamepadL2tick';
// R2
enchant.Event.GAMEPAD_R2 = 'gamepadR2';
enchant.Event.GAMEPAD_R2_UP = 'gamepadR2up';
enchant.Event.GAMEPAD_R2_DOWN = 'gamepadR2down';
enchant.Event.GAMEPAD_R2_TICK = 'gamepadR2tick';
// select
enchant.Event.GAMEPAD_SELECT = 'gamepadselect';
enchant.Event.GAMEPAD_SELECT_UP = 'gamepadselectup';
enchant.Event.GAMEPAD_SELECT_DOWN = 'gamepadselectdown';
enchant.Event.GAMEPAD_SELECT_TICK = 'gamepadselecttick';
// start
enchant.Event.GAMEPAD_START = 'gamepadstart';
enchant.Event.GAMEPAD_START_UP = 'gamepadstartup';
enchant.Event.GAMEPAD_START_DOWN = 'gamepadstartdown';
enchant.Event.GAMEPAD_START_TICK = 'gamepadstarttick';
// LEFT STICK
enchant.Event.GAMEPAD_LEFT_STICK = 'gamepadleftstick';
// RIGHT STICK
enchant.Event.GAMEPAD_RIGHT_STICK = 'gamepadrightstick';
// LEFT
enchant.Event.GAMEPAD_LEFT = 'gamepadleft';
enchant.Event.GAMEPAD_LEFT_UP = 'gamepadleftup';
enchant.Event.GAMEPAD_LEFT_DOWN = 'gamepadleftdown';
enchant.Event.GAMEPAD_LEFT_TICK = 'gamepadlefttick';
// RIGHT
enchant.Event.GAMEPAD_RIGHT = 'gamepadright';
enchant.Event.GAMEPAD_RIGHT_UP = 'gamepadrightup';
enchant.Event.GAMEPAD_RIGHT_DOWN = 'gamepadrightdown';
enchant.Event.GAMEPAD_RIGHT_TICK = 'gamepadrighttick';
// UP
enchant.Event.GAMEPAD_UP = 'gamepadup';
enchant.Event.GAMEPAD_UP_UP = 'gamepadupup';
enchant.Event.GAMEPAD_UP_DOWN = 'gamepadupdown';
enchant.Event.GAMEPAD_UP_TICK = 'gamepaduptick';
//
enchant.Event.GAMEPAD_DOWN = 'gamepaddown';
enchant.Event.GAMEPAD_DOWN_UP = 'gamepaddownup';
enchant.Event.GAMEPAD_DOWN_DOWN = 'gamepaddowndown';
enchant.Event.GAMEPAD_DOWN_TICK = 'gamepaddowntick';

enchant.GamePad = enchant.Class.create(enchant.EventTarget, {
    initialize: function(playerId) {
        var core = enchant.Core.instance;
        enchant.EventTarget.call(this);
        this._playerId = playerId;
        this._buttonPressed = [[],[]];

        this.addEventListener(Event.ENTER_FRAME, function(e) {
            var gamepad_list = navigator.getGamepads();
            for(var i=0;i < gamepad_list.length;i++){
                var gamepad = gamepad_list[i];
                if(!gamepad) continue;
                if (this._playerId!==undefined) if (this._playerId != i) continue;
                var mapping = gamepad.mapping;
                var buttons = gamepad.buttons;
                for(var j=0;j < buttons.length;j++){
                    var button = buttons[j];
                    if (button.pressed) {
                        this._createDispatchEvent(button, "gamepad");
                    }
                    // A
                    if (j==1) {
                        this._dispatchButtonPressedEvent(button, "A", i, j);
                    }
                    // B
                    if (j==0) {
                        this._dispatchButtonPressedEvent(button, "B", i, j);
                    }
                    // X
                    if (j==3) {
                        this._dispatchButtonPressedEvent(button, "X", i, j);
                    }
                    // Y
                    if (j==2) {
                        this._dispatchButtonPressedEvent(button, "Y", i, j);
                    }
                    // L1
                    if (j==4) {
                        this._dispatchButtonPressedEvent(button, "L1", i, j);
                    }
                    // R1
                    if (j==5) {
                        this._dispatchButtonPressedEvent(button, "R1", i, j);
                    }
                    // L2
                    if (j==6) {
                        this._dispatchButtonPressedEvent(button, "L2", i, j);
                    }
                    // R2
                    if (j==7) {
                        this._dispatchButtonPressedEvent(button, "R2", i, j);
                    }
                    // SELECT
                    if (j==8) {
                        this._dispatchButtonPressedEvent(button, "select", i, j);
                    }
                    // START
                    if (j==9) {
                        this._dispatchButtonPressedEvent(button, "start", i, j);
                    }
                    // LEFT_STICK
                    if (j==10) {
                        this._dispatchButtonPressedEvent(button, "leftstick", i, j);
                    }
                    // RIGHT_STICK
                    if (j==11) {
                        this._dispatchButtonPressedEvent(button, "rightstick", i, j);
                    }
                    // UP
                    if (j==12) {
                        this._dispatchButtonPressedEvent(button, "up", i, j);
                    }
                    // DOWN
                    if (j==13) {
                        this._dispatchButtonPressedEvent(button, "down", i, j);
                    }
                    // LEFT
                    if (j==14) {
                        this._dispatchButtonPressedEvent(button, "left", i, j);
                    }
                    // RIGHT
                    if (j==15) {
                        this._dispatchButtonPressedEvent(button, "right", i, j);
                    }
                }
            }
        });
    },
    _dispatchButtonPressedEvent : function(button, eventName, i, j) {
         if (button.pressed) {
             this._createDispatchEvent(button, "gamepad" + eventName);
             this._createDispatchEvent(button, "gamepad" + eventName + "tick");
             if (this._buttonPressed[i][j] != true) {
                 this._createDispatchEvent(button, "gamepad" + eventName + "down");
                 this._buttonPressed[i][j] = true;
             }
        } else {
            if (this._buttonPressed[i][j] == true) {
                this._createDispatchEvent(button, "gamepad" + eventName + "up");
                this._buttonPressed[i][j] = false;
            }
        }
    },
    _createDispatchEvent : function(button, type) {
        e = new Event();
        e.buttons = {};
        e.buttons.pressed = button.pressed;
        e.buttons.value = button.value;
        e.type = type;
        this.dispatchEvent(e);
    }
});
