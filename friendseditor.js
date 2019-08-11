function _createKey(key) {
    var _pref = "";
    if (getUserName) _pref += getUserName() + "_";
    if (getUserSave) _pref += getUserSave() + "_";
    return _pref + key;
}

function getLocalStorage(key) {
    return localStorage.getItem(_createKey(key));
}

function setLocalStorage(key, value) {
    localStorage.setItem(_createKey(key), value);
}

function removeLocalStorage(key) {
    localStorage.removeItem(_createKey(key));
}

function _loadScript(scripts) {
    var i = 0;
    (function appendScript() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scripts[i];
        document.body.appendChild(script);
        if (i++ < scripts.length - 1) {
            script.onload = appendScript;
        }
    })();
}

function loadScript(id, slot) {
    var nowTime = new Date();
    var time = nowTime.getFullYear();
    time += "0" + (nowTime.getMonth() + 1).toString().slice(-2);
    time += "0" + nowTime.getDate().toString().slice(-2);
    time += "0" + nowTime.getHours().toString().slice(-2);
    time += "0" + nowTime.getMinutes().toString().slice(-2);
    time += "0" + nowTime.getSeconds().toString().slice(-2);
    _loadScript(["sources/" + id + "/main_" + slot + ".js?" + time]);
}

enchant.Core.prototype.start = function(deferred) {
    var onloadTimeSetter = function() {
        this.frame = 0;
        this.removeEventListener('load', onloadTimeSetter);
    };
    this.addEventListener('load', onloadTimeSetter);

    this.currentTime = window.getTime();
    this.running = true;
    this.ready = true;

    if (!this._activated) {
        this._activated = true;
        if (enchant.ENV.BROWSER === 'mobilesafari' &&
            enchant.ENV.USE_WEBAUDIO &&
            enchant.ENV.USE_TOUCH_TO_START_SCENE) {
            var d = new enchant.Deferred();
            var scene = this._createTouchToStartScene();
            scene.addEventListener(enchant.Event.TOUCH_START, function waitTouch() {
                this.removeEventListener(enchant.Event.TOUCH_START, waitTouch);
                var a = new enchant.WebAudioSound();
                a.buffer = enchant.WebAudioSound.audioContext.createBuffer(1, 1, 48000);
                a.play();
                core.removeScene(scene);
                core.start(d);
            }, false);
            core.pushScene(scene);
            return d;
        }
    }

    this._requestNextFrame(0);
    this.ready = false;
    setTimeout(function() {
        var core = enchant.Core.instance;
        core.ready = true;
        core._requestNextFrame(0);
    }, 100);

    var ret = this._requestPreload()
        .next(function() {
            enchant.Core.instance.loadingScene.dispatchEvent(new enchant.Event(enchant.Event.LOAD));
        });

    if (deferred) {
        ret.next(function(arg) {
            deferred.call(arg);
        })
        .error(function(arg) {
            deferred.fail(arg);
        });
    }

    return ret;
}

(function() {
    enchant.ENV._PREVENT_DEFAULT_KEY_CODES = enchant.ENV.PREVENT_DEFAULT_KEY_CODES;
    $(".ex-code-prettify-edit").click(function() {
        enchant.ENV.PREVENT_DEFAULT_KEY_CODES = [];
    });
    $(".ex-code-prettify-save").click(function() {
        enchant.ENV.PREVENT_DEFAULT_KEY_CODES = enchant.ENV._PREVENT_DEFAULT_KEY_CODES;
    });
    $(".ex-code-prettify-cancel").click(function() {
        enchant.ENV.PREVENT_DEFAULT_KEY_CODES = enchant.ENV._PREVENT_DEFAULT_KEY_CODES;
    });
}());
