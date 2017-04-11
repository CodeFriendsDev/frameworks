// Common
//console.log("common.js");

var another_assets = "http://yoshitoimai.sakura.ne.jp/codefriends/test_education/assets/";

function createElement(tag) {
    return document.createElement(tag);
};

function innerHtml(object, src) {
    object.innerHTML = src;
};

function getRandom(start, end) {
    return start + Math.floor( Math.random() * (end - start + 1));
}

function getDistance(originX, originY, destX, destY) {
    return Math.sqrt(Math.pow(destX - originX, 2) + Math.pow(destY - originY , 2));
}

function getRadian(originX, originY, destX, destY) {
    return Math.atan2(destY - originY, destX - originX);
}

function getRotation(originX, originY, destX, destY) {
    var radian = getRadian(originX, originY, destX, destY);
    return radian / (Math.PI / 180) + 90;
}