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

function rot13(str) {
    var i =[];
    i = str.split('');
    return i.map.call( i,function(char) {
        x = char.charCodeAt(0);
        if ((65 <= x && x < 78) || (97 <= x && x < 110)) {
            return String.fromCharCode(x + 13);
        } else if ((78 <= x && x <= 90) || (110 <= x && x <= 122) ) {
              return String.fromCharCode(x - 13);
        }
        return String.fromCharCode(x);
    }).join('');
}
