function createKey(key) {
    var _pref = "";
    if (getUserName) _pref += getUserName() + "_";
    if (getUserSave) _pref += getUserSave() + "_";
    return _pref + key;
}

function getLocalStorage(key) {
    return localStorage.getItem(createKey(key));
}

function setLocalStorage(key, value) {
    localStorage.setItem(createKey(key), value);
}

function removeLocalStorage(key) {
    localStorage.removeItem(createKey(key));
}
