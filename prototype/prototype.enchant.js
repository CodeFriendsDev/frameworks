/**
 * Entity
 */


/**
 * Spriteの中心のx座標.
 * @type {Number}
 */
Object.defineProperty(enchant.Entity.prototype, "centerX", {
    get: function centerX() {
        return this.x + this.width / 2;
    },
    set: function centerX(x) {
        this.x = x - this.width / 2;
    }
});
/**
 * Spriteの中心のy座標.
 * @type {Number}
 */
Object.defineProperty(enchant.Entity.prototype, "centerY", {
    get: function centerY() {
        return this.y + this.height / 2;
    },
    set: function centerY(y) {
        this.y = y - this.height / 2;
    }
});


enchant.Entity.prototype.getOrientedBoundingRect = function() {
//    var w = this.width || 0;
//    var h = this.height || 0;
    var w = this.width - 1 || 0;
    var h = this.height - 1 || 0;
    var mat = this._matrix;
    var m11w = mat[0] * w, m12w = mat[1] * w,
        m21h = mat[2] * h, m22h = mat[3] * h,
        mdx = mat[4], mdy = mat[5];

    return {
        leftTop: [ mdx, mdy ],
        rightTop: [ m11w + mdx, m12w + mdy ],
        leftBottom: [ m21h + mdx, m22h + mdy],
        rightBottom: [ m11w + m21h + mdx, m12w + m22h + mdy]
    };
};


enchant.Entity.prototype._intersectStrictOne = function(other) {
    if (this._dirty) {
        this._updateCoordinate();
    } if (other._dirty) {
        other._updateCoordinate();
    }
    var rect1 = this.getOrientedBoundingRect(),
        rect2 = other.getOrientedBoundingRect(),
        lt1 = rect1.leftTop, rt1 = rect1.rightTop,
        lb1 = rect1.leftBottom, rb1 = rect1.rightBottom,
        lt2 = rect2.leftTop, rt2 = rect2.rightTop,
        lb2 = rect2.leftBottom, rb2 = rect2.rightBottom,
        ltx1 = lt1[0], lty1 = lt1[1], rtx1 = rt1[0], rty1 = rt1[1],
        lbx1 = lb1[0], lby1 = lb1[1], rbx1 = rb1[0], rby1 = rb1[1],
        ltx2 = lt2[0], lty2 = lt2[1], rtx2 = rt2[0], rty2 = rt2[1],
        lbx2 = lb2[0], lby2 = lb2[1], rbx2 = rb2[0], rby2 = rb2[1],
        t1 = [ rtx1 - ltx1, rty1 - lty1 ],
        r1 = [ rbx1 - rtx1, rby1 - rty1 ],
        b1 = [ lbx1 - rbx1, lby1 - rby1 ],
        l1 = [ ltx1 - lbx1, lty1 - lby1 ],
        t2 = [ rtx2 - ltx2, rty2 - lty2 ],
        r2 = [ rbx2 - rtx2, rby2 - rty2 ],
        b2 = [ lbx2 - rbx2, lby2 - rby2 ],
        l2 = [ ltx2 - lbx2, lty2 - lby2 ],
        cx1 = (ltx1 + rtx1 + lbx1 + rbx1) >> 2,
        cy1 = (lty1 + rty1 + lby1 + rby1) >> 2,
        cx2 = (ltx2 + rtx2 + lbx2 + rbx2) >> 2,
        cy2 = (lty2 + rty2 + lby2 + rby2) >> 2,
        i, j, poss1, poss2, dirs1, dirs2, pos1, pos2, dir1, dir2,
        px1, py1, px2, py2, dx1, dy1, dx2, dy2, vx, vy, c, c1, c2;
    if (t1[0] * (cy2 - lty1) - t1[1] * (cx2 - ltx1) > 0 &&
        r1[0] * (cy2 - rty1) - r1[1] * (cx2 - rtx1) > 0 &&
        b1[0] * (cy2 - rby1) - b1[1] * (cx2 - rbx1) > 0 &&
        l1[0] * (cy2 - lby1) - l1[1] * (cx2 - lbx1) > 0) {
        return true;
    } else if (t2[0] * (cy1 - lty2) - t2[1] * (cx1 - ltx2) > 0 &&
        r2[0] * (cy1 - rty2) - r2[1] * (cx1 - rtx2) > 0 &&
        b2[0] * (cy1 - rby2) - b2[1] * (cx1 - rbx2) > 0 &&
        l2[0] * (cy1 - lby2) - l2[1] * (cx1 - lbx2) > 0) {
        return true;
    } else {
        poss1 = [ lt1, rt1, rb1, lb1 ];
        poss2 = [ lt2, rt2, rb2, lb2 ];
        dirs1 = [ t1, r1, b1, l1 ];
        dirs2 = [ t2, r2, b2, l2 ];
        for (i = 0; i < 4; i++) {
            pos1 = poss1[i];
            px1 = pos1[0]; py1 = pos1[1];
            dir1 = dirs1[i];
            dx1 = dir1[0]; dy1 = dir1[1];
            for (j = 0; j < 4; j++) {
                pos2 = poss2[j];
                px2 = pos2[0]; py2 = pos2[1];
                dir2 = dirs2[j];
                dx2 = dir2[0]; dy2 = dir2[1];
                c = dx1 * dy2 - dy1 * dx2;
                if (c !== 0) {
                    vx = px2 - px1;
                    vy = py2 - py1;
                    c1 = (vx * dy1 - vy * dx1) / c;
                    c2 = (vx * dy2 - vy * dx2) / c;
//                    if (0 < c1 && c1 < 1 && 0 < c2 && c2 < 1) {
                    if (0 <= c1 && c1 <= 1 && 0 <= c2 && c2 <= 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
};

/**
 * 指定オブジェクト内でx方向の中央寄せを行う。
 * @param {Object} [another] 基準となるオブジェクト。（省略時は親Nodeとなる）
 */
enchant.Entity.prototype.alignHorizontalCenterIn = function(another) {
    var parentNode = this.parentNode;
    if (another) parentNode = another;
    if (parentNode) {
        this.x = parentNode.x + ~~(parentNode.width / 2) - ~~(this.width / 2);
    }
};
/**
 * 指定オブジェクト内でy方向の中央寄せを行う。
 * @param {Object} [another] 基準となるオブジェクト。（省略時は親Nodeとなる）
 */
enchant.Entity.prototype.alignVerticalCenterIn = function(another) {
    var parentNode = this.parentNode;
    if (another) parentNode = another;
    if (parentNode) {
        this.y = parentNode.y + ~~(parentNode.height / 2) - ~~(this.height / 2);
    }
};


/**
 * Node
 */

/**
 * Nodeの可動域を設定する
 * @param {Object} [target] 可動域の中心となるオブジェクト。
 * @param {Object} [rangeTop] 上部の可動域
 * @param {Object} [rangeBottom] 下部の可動域
 * @param {Object} [rangeLeft] 左側の可動域
 * @param {Object} [rangeRight] 右側の可動域
 */
enchant.Node.prototype._rangeOfMotionArg = null;
enchant.Node.prototype.setRangeOfMotion = function(target, rangeTop, rangeBottom, rangeLeft, rangeRight) {
    if (rangeTop==null)  throw new Error("rangeTop is undefined (enchant.Node.setRangeOfMotion)");
    if (rangeBottom==null)  throw new Error("rangeBottom is undefined (enchant.Node.setRangeOfMotion)");
    if (rangeLeft==null)  throw new Error("rangeLeft is undefined (enchant.Node.setRangeOfMotion)");
    if (rangeRight==null)  throw new Error("rangeRight is undefined (enchant.Node.setRangeOfMotion)");
    this._rangeOfMotion = {
        target: target,
        rangeTop: rangeTop,
        rangeBottom: rangeBottom,
        rangeLeft: rangeLeft,
        rangeRight: rangeRight
    };
    this.addEventListener(Event.ENTER_FRAME, function() {
        this._rangeOfMotionArg = arguments.callee;
        var target = this._rangeOfMotion.target;
        if (target._offsetY < this._rangeOfMotion.rangeTop) {
            this.y += this._rangeOfMotion.rangeTop - target._offsetY;
        }
        if (target._offsetY > this._rangeOfMotion.rangeBottom - target.height) {
            this.y += this._rangeOfMotion.rangeBottom - target._offsetY - target.height;
        }
        if (target._offsetX < this._rangeOfMotion.rangeLeft) {
            this.x += this._rangeOfMotion.rangeLeft - target._offsetX;
        }
        if (target._offsetX > this._rangeOfMotion.rangeRight - target.width) {
            this.x += this._rangeOfMotion.rangeRight - target._offsetX - target.width;
        }
    });
};
enchant.Node.prototype.removeRangeOfMotion = function(origin, rangeTop, rangeBottom, rangeLeft, rangeRight) {
    if (this._rangeOfMotionArg) {
        this.removeEventListener(Event.ENTER_FRAME, this._rangeOfMotionArg);
        this._rangeOfMotionArg = null;
    }
};
enchant.Node.prototype.isfollowRelativeBased = true;
enchant.Node.prototype.setfollowRelativeBased = function() {
    this.isfollowRelativeBased = true;
}
enchant.Node.prototype.setfollowAbsoluteBased = function() {
    this.isfollowRelativeBased = false;
}
/**
 * ターゲットに指定したNodeと一緒に移動します。
 * @param {enchant.Node} target ターゲットを指定します。
 * @example
 * var target = new Sprite(32, 32);
 * core.rootScene.addChild(target);
 *
 * var sprite = new Sprite(32, 32);
 * sprite.follow(target);
 * core.rootScene.addChild(sprite);
 *
 * target.tl.moveTo(10, 10, 10);
 * //sprite.tl.moveTo(10, 10, 10);
 *
 */
enchant.Node.prototype.follow = function(target) {
    this.unfollow();
    this._followTarget = target;
    this._followTargetHistory = {};
    this._followTargetHistory.x = this._followTarget.x;
    this._followTargetHistory.y = this._followTarget.y;
    this.addEventListener(Event.ENTER_FRAME, function() {
        this._followArg = arguments.callee;
        if (this.isfollowRelativeBased == true) {
            this.x += this._followTarget.x - this._followTargetHistory.x;
            this.y += this._followTarget.y - this._followTargetHistory.y;
            this._followTargetHistory.x = this._followTarget.x;
            this._followTargetHistory.y = this._followTarget.y;
        } else {
        }
    });
}
/**
 * followを解除します。
 */
enchant.Node.prototype.unfollow = function() {
    if (this._followArg) {
        this.removeEventListener(Event.ENTER_FRAME, this._followArg);
        this._followArg = null;
    }
}


/**
 * Sprite
 */

enchant.Sprite.prototype.border = function(width, color, radius) {
    var surface = new Surface(this.width, this.height);
    if (this.image) surface.draw(this.image);
    this.image = surface;
    surface.context.lineWidth = width;
    surface.context.strokeStyle = color;
    roundedRect(surface, 0, 0, surface.width, surface.height, radius);
    function roundedRect(surface, x, y, width, height, radius){
        var ctx = surface.context;
        var image = surface.clone();
        surface.clear();
        var margin = ctx.lineWidth / 2;
        //x += margin; y += margin; width -= margin*2; height -= margin*2;
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.arcTo(x, y + height, x + radius, y + height, radius);
        ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
        ctx.arcTo(x + width, y, x + width - radius, y, radius);
        ctx.arcTo(x, y, x, y + radius, radius);
        ctx.closePath();
        ctx.clip();
        surface.draw(image);
        ctx.stroke();
    }
};

/**
 * Label
 */

enchant.Label.prototype.delayText = function(delayTime) {
    if (!this.arrayText) this.arrayText = [];
    this.arrayText = this.arrayText.concat(this.text.split(""));
    this.text = "";
    _this = this;
    for (var i=0; i < this.arrayText.length; i++) {
        setTimeout(function() {
            _this.text += _this.arrayText.shift();
        }, i * delayTime);
    }
}

/**
 * Group
 */
enchant.Group.prototype.setCenterNode = function(child, parent) {
    var _parentNode = parent || this.parentNode;
    this.addEventListener(Event.ADDED_TO_SCENE, function(){
        this.x = ~~(_parentNode.width / 2) - ~~(child.width / 2) - child.x;
        this.y = ~~(_parentNode.height / 2) - ~~(child.height / 2) - child.y;
    });
    this.addEventListener(Event.ENTER_FRAME, function(){
        this.x = ~~(_parentNode.width / 2) - ~~(child.width / 2) - child.x;
        this.y = ~~(_parentNode.height / 2) - ~~(child.height / 2) - child.y;
    });
};

