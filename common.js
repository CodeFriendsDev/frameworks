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

function Speech(text, volume, rate, pitch) {
	this._utter = new SpeechSynthesisUtterance();
	this._utter.voices = window.speechSynthesis.getVoices();
	this._utter.lang     = "ja-JP";
	this._utter.voiceURI = "Google 日本人";
	this._utter.volume   = volume || 0.5; // 音量 min 0 ~ max 1
	this._utter.rate     = rate || 1.0; // 速度 min 0 ~ max 3
	this._utter.pitch    = pitch || 1.0; // 音程 min 0 ~ max 2
	this._utter.text = text || "";
	this.speak = function(text, volume, rate, pitch) {
		this._utter.volume   = volume || this._utter.volume || 0.5;
		this._utter.rate     = rate || this._utter.rate || 1.0;
		this._utter.pitch    = pitch || this._utter.pitch || 1.0;
		this._utter.text = text || this._utter.text || "";
		speechSynthesis.speak(this._utter);
	}
}
Object.defineProperty(Speech.prototype, "lang", {
	set: function (value) {
		this._utter.lang = value;
	},
	get: function() {
		return this._utter.lang;
	}
});
Object.defineProperty(Speech.prototype, "voiceURI", {
	set: function (value) {
		this._utter.voiceURI = value;
	},
	get: function() {
		return this._utter.voiceURI;
	}
});
Object.defineProperty(Speech.prototype, "volume", {
	set: function (value) {
		this._utter.volume = value;
	},
	get: function() {
		return this._utter.volume;
	}
});
Object.defineProperty(Speech.prototype, "rate", {
	set: function (value) {
		this._utter.rate = value;
	},
	get: function() {
		return this._utter.rate;
	}
});
Object.defineProperty(Speech.prototype, "pitch", {
	set: function (value) {
		this._utter.pitch = value;
	},
	get: function() {
		return this._utter.pitch;
	}
});
Object.defineProperty(Speech.prototype, "text", {
	set: function (value) {
		this._utter.text = value;
	},
	get: function() {
		return this._utter.text;
	}
});
