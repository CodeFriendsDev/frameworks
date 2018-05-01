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
