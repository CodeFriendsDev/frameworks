/**
 * Entity
 */


/**
 *Entityの中心のx座標.
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
 * Entityの中心のy座標.
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
/**
 * Entityの右端のx座標.
 * @type {Number}
 */
Object.defineProperty(enchant.Entity.prototype, "bottomX", {
    get: function bottomX() {
        return this.x + this.width;
    },
    set: function bottomX(x) {
        this.x = x - this.width;
    }
});
/**
 * Entityの下端のy座標.
 * @type {Number}
 */
Object.defineProperty(enchant.Entity.prototype, "bottomY", {
    get: function bottomY() {
        return this.y + this.height;
    },
    set: function bottomY(y) {
        this.y = y - this.height;
    }
});

enchant.Entity.prototype.getOrientedBoundingRect = function () {
    //    var w = this.width || 0;
    //    var h = this.height || 0;
    var w = this.width - 1 || 0;
    var h = this.height - 1 || 0;
    var mat = this._matrix;
    var m11w = mat[0] * w, m12w = mat[1] * w,
        m21h = mat[2] * h, m22h = mat[3] * h,
        mdx = mat[4], mdy = mat[5];

    return {
        leftTop: [mdx, mdy],
        rightTop: [m11w + mdx, m12w + mdy],
        leftBottom: [m21h + mdx, m22h + mdy],
        rightBottom: [m11w + m21h + mdx, m12w + m22h + mdy]
    };
};


enchant.Entity.prototype._intersectStrictOne = function (other) {
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
        t1 = [rtx1 - ltx1, rty1 - lty1],
        r1 = [rbx1 - rtx1, rby1 - rty1],
        b1 = [lbx1 - rbx1, lby1 - rby1],
        l1 = [ltx1 - lbx1, lty1 - lby1],
        t2 = [rtx2 - ltx2, rty2 - lty2],
        r2 = [rbx2 - rtx2, rby2 - rty2],
        b2 = [lbx2 - rbx2, lby2 - rby2],
        l2 = [ltx2 - lbx2, lty2 - lby2],
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
        poss1 = [lt1, rt1, rb1, lb1];
        poss2 = [lt2, rt2, rb2, lb2];
        dirs1 = [t1, r1, b1, l1];
        dirs2 = [t2, r2, b2, l2];
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
enchant.Entity.prototype.alignHorizontalCenterIn = function (another) {
    var parentNode = this.parentNode;
    if (another) parentNode = another;
    if (parentNode) {
        this.x = parentNode.x + ~~(parentNode.width / 2) - ~~(this.width / 2);
    }
    return this;
};
/**
 * 指定オブジェクト内でy方向の中央寄せを行う。
 * @param {Object} [another] 基準となるオブジェクト。（省略時は親Nodeとなる）
 */
enchant.Entity.prototype.alignVerticalCenterIn = function (another) {
    var parentNode = this.parentNode;
    if (another) parentNode = another;
    if (parentNode) {
        this.y = parentNode.y + ~~(parentNode.height / 2) - ~~(this.height / 2);
    }
    return this;
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
enchant.Node.prototype.setRangeOfMotion = function (target, rangeTop, rangeBottom, rangeLeft, rangeRight) {
    if (rangeTop == null) throw new Error("rangeTop is undefined (enchant.Node.setRangeOfMotion)");
    if (rangeBottom == null) throw new Error("rangeBottom is undefined (enchant.Node.setRangeOfMotion)");
    if (rangeLeft == null) throw new Error("rangeLeft is undefined (enchant.Node.setRangeOfMotion)");
    if (rangeRight == null) throw new Error("rangeRight is undefined (enchant.Node.setRangeOfMotion)");
    this._rangeOfMotion = {
        target: target,
        rangeTop: rangeTop,
        rangeBottom: rangeBottom,
        rangeLeft: rangeLeft,
        rangeRight: rangeRight
    };
    this.addEventListener(Event.ENTER_FRAME, function () {
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
enchant.Node.prototype.removeRangeOfMotion = function (origin, rangeTop, rangeBottom, rangeLeft, rangeRight) {
    if (this._rangeOfMotionArg) {
        this.removeEventListener(Event.ENTER_FRAME, this._rangeOfMotionArg);
        this._rangeOfMotionArg = null;
    }
};
enchant.Node.prototype.isfollowRelativeBased = true;
enchant.Node.prototype.setfollowRelativeBased = function () {
    this.isfollowRelativeBased = true;
}
enchant.Node.prototype.setfollowAbsoluteBased = function () {
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
enchant.Node.prototype.follow = function (target) {
    this.unfollow();
    this._followTarget = target;
    this._followTargetHistory = {};
    this._followTargetHistory.x = this._followTarget.x;
    this._followTargetHistory.y = this._followTarget.y;
    this.addEventListener(Event.ENTER_FRAME, function () {
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
enchant.Node.prototype.unfollow = function () {
    if (this._followArg) {
        this.removeEventListener(Event.ENTER_FRAME, this._followArg);
        this._followArg = null;
    }
}


/**
 * Sprite
 */

enchant.Sprite.prototype.border = function (width, color, radius) {
    var surface = new Surface(this.width, this.height);
    if (this.image) surface.draw(this.image);
    this.image = surface;
    surface.context.lineWidth = width;
    surface.context.strokeStyle = color;
    roundedRect(surface, 0, 0, surface.width, surface.height, radius);
    function roundedRect(surface, x, y, width, height, radius) {
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

enchant.Label.prototype.delayText = function (delayTime) {
    if (!this.arrayText) this.arrayText = [];
    this.arrayText = this.arrayText.concat(this.text.split(""));
    this.text = "";
    _this = this;
    for (var i = 0; i < this.arrayText.length; i++) {
        setTimeout(function () {
            _this.text += _this.arrayText.shift();
        }, i * delayTime);
    }
}

/**
 * Group
 */
enchant.Group.prototype.setCenterNode = function (child, parent) {
    var _parentNode = parent || this.parentNode;
    this.addEventListener(Event.ADDED_TO_SCENE, function () {
        this.x = ~~(_parentNode.width / 2) - ~~(child.width / 2) - child.x;
        this.y = ~~(_parentNode.height / 2) - ~~(child.height / 2) - child.y;
    });
    this.addEventListener(Event.RENDER, function () {
        this.x = ~~(_parentNode.width / 2) - ~~(child.width / 2) - child.x;
        this.y = ~~(_parentNode.height / 2) - ~~(child.height / 2) - child.y;
    });
};
/**
 * Scene
 */

enchant.Group.prototype._scrollRangeTarget = null;
Object.defineProperty(enchant.Group.prototype, "scrollRangeTarget", {
    get: function scrollRangeTarget() {
        return this._scrollRangeTarget;
    },
    set: function scrollRangeTarget(value) {
        this._scrollRangeTarget = value;
    }
});
enchant.Group.prototype._scrollRotationAngle = null;
Object.defineProperty(enchant.Group.prototype, "scrollRotationAngle", {
    get: function scrollRotationAngle() {
        return this._scrollRotationAngle;
    },
    set: function scrollRotationAngle(value) {
        this._scrollRotationAngle = value;
    }
});
enchant.Group.prototype._scrollRotationEnabled = false;
Object.defineProperty(enchant.Group.prototype, "scrollRotationEnabled", {
    get: function scrollRotationEnabled() {
        return this._scrollRotationEnabled;
    },
    set: function scrollRotationEnabled(value) {
        this._scrollRotationEnabled = value;
    }
});

enchant.Group.prototype._scrollRangeEnableLimit = false;
Object.defineProperty(enchant.Group.prototype, "scrollRangeEnableLimit", {
    get: function scrollRangeEnableLimit() {
        return this._scrollRangeEnableLimit;
    },
    set: function scrollRangeEnableLimit(value) {
        this._scrollRangeEnableLimit = value;
    }
});
enchant.Group.prototype._scrollRangeLimitLeft = 0;
Object.defineProperty(enchant.Group.prototype, "scrollRangeLimitLeft", {
    get: function scrollRangeLimitLeft() {
        return this._scrollRangeLimitLeft;
    },
    set: function scrollRangeLimitLeft(value) {
        this._scrollRangeLimitLeft = value;
    }
});
enchant.Group.prototype._scrollRangeLimitRight = 0;
Object.defineProperty(enchant.Group.prototype, "scrollRangeLimitRight", {
    get: function scrollRangeLimitRight() {
        return this._scrollRangeLimitRight;
    },
    set: function scrollRangeLimitRight(value) {
        this._scrollRangeLimitRight = value;
    }
});
enchant.Group.prototype._scrollRangeLimitTop = 0;
Object.defineProperty(enchant.Group.prototype, "scrollRangeLimitTop", {
    get: function scrollRangeLimitTop() {
        return this._scrollRangeLimitTop;
    },
    set: function scrollRangeLimitTop(value) {
        this._scrollRangeLimitTop = value;
    }
});
enchant.Group.prototype._scrollRangeLimitBottom = 0;
Object.defineProperty(enchant.Group.prototype, "scrollRangeLimitBottom", {
    get: function scrollRangeLimitBottom() {
        return this._scrollRangeLimitBottom;
    },
    set: function scrollRangeLimitBottom(value) {
        this._scrollRangeLimitBottom = value;
    }
});
enchant.Group.prototype.setScrollRangeLimitX = function (limitLeft, limitRight) {
    this._scrollRangeLimitLeft = limitLeft;
    this._scrollRangeLimitRight = limitRight;
}
enchant.Group.prototype.setScrollRangeLimitY = function (limitTop, limitBottom) {
    this._scrollRangeLimitTop = limitTop;
    this._scrollRangeLimitBottom = limitBottom;
}
enchant.Group.prototype.setScrollRange = function (child, padding) {
    var core = enchant.Core.instance;
    this.width = this.width || core.rootScene.width;
    this.height = this.height || core.rootScene.height;
    // EnterFrameを解除
    this.cancelScrollRange();
    var _padding = {
        top: isFinite(arguments[1])
            ? arguments[1] : 0,
        right: isFinite(arguments[2])
            ? arguments[2] : isFinite(arguments[1])
                ? arguments[1] : 0,
        bottom: isFinite(arguments[3])
            ? arguments[3] : isFinite(arguments[1])
                ? arguments[1] : 0,
        left: isFinite(arguments[4])
            ? arguments[4] : isFinite(arguments[2])
                ? arguments[2] : isFinite(arguments[1])
                    ? arguments[1] : 0
    };
    // paddingが設定可能最大値より大きい場合、paddingを再設定
    this._scrollRangeTarget = child;
    if (_padding.left + _padding.right + this._scrollRangeTarget.width > this.width) {
        var _diff = (_padding.left + _padding.right + this._scrollRangeTarget.width - this.width) / 2;
        _padding.left -= _diff;
        _padding.right -= _diff;
    }
    if (_padding.top + _padding.bottom + this._scrollRangeTarget.height > this.height) {
        var _diff = (_padding.top + _padding.bottom + this._scrollRangeTarget.height - this.height) / 2;
        _padding.top -= _diff;
        _padding.bottom -= _diff;
    }
    // 対象が画面の表示領域からはみ出ようとした時にスクロールさせる
    this._scrollRange = function () {
        if (!this._scrollRangeTarget || !this._scrollRangeTarget.parentNode) return;
        if (!this._scrollRangeTarget || !this._scrollRangeTarget.parentNode) this.cancelScrollRange();
        // Left
        if (this._scrollRangeEnableLimit && this.x == this._scrollRangeLimitLeft) {
        } else if (this._scrollRangeEnableLimit && this.x > this._scrollRangeLimitLeft) {
            this.x = this._scrollRangeLimitLeft;
        } else if (_padding.left != null && this._scrollRangeTarget.x < _padding.left - this.x) {
            this.x += (_padding.left - this.x) - this._scrollRangeTarget.x;
            this.x = Math.round(this.x);
        }
        // Right
        if (this._scrollRangeEnableLimit && this.x == this.width - this._scrollRangeLimitRight) {
        } else if (this._scrollRangeEnableLimit && this.x < this.width - this._scrollRangeLimitRight) {
            this.x = this.width - this._scrollRangeLimitRight;
        } else if (_padding.right != null && this._scrollRangeTarget.x + this._scrollRangeTarget.width > this.width - _padding.right - this.x) {
            this.x -= this._scrollRangeTarget.x + this._scrollRangeTarget.width - (this.width - _padding.right - this.x);
            this.x = Math.round(this.x);
        }
        // Top
        if (this._scrollRangeEnableLimit && this.y == this._scrollRangeLimitTop) {
        } else if (this._scrollRangeEnableLimit && this.y > this._scrollRangeLimitTop) {
            this.y = this._scrollRangeLimitTop;
        } else if (_padding.top != null && this._scrollRangeTarget.y < _padding.top - this.y) {
            this.y += (_padding.top - this.y) - this._scrollRangeTarget.y;
            this.y = Math.round(this.y);
        }
        // Bottom
        if (this._scrollRangeEnableLimit && this.y == this.height - this._scrollRangeLimitBottom) {
        } else if (this._scrollRangeEnableLimit && this.y < this.height - this._scrollRangeLimitBottom) {
            this.y = this.height - this._scrollRangeLimitBottom;
        } else if (_padding.bottom != null && this._scrollRangeTarget.y + this._scrollRangeTarget.height > this.height - _padding.bottom - this.y) {
            this.y -= this._scrollRangeTarget.y + this._scrollRangeTarget.height - (this.height - _padding.bottom - this.y);
            this.y = Math.round(this.y);
        }
        this.originX = this._scrollRangeTarget.x;
        this.originY = this._scrollRangeTarget.y;
        if (this._scrollRotationEnabled) {
            this.rotation = this._scrollRotationAngle || -this._scrollRangeTarget.rotation;
        }
    }
    this.addEventListener(Event.ENTER_FRAME, this._scrollRange);
};
enchant.Group.prototype.cancelScrollRange = function () {
    // EnterFrameを解除
    if (this._scrollRange) {
        this.removeEventListener(Event.ENTER_FRAME, this._scrollRange);
        this._scrollRange = null;
        this._scrollRangeTarget = null;
        this._scrollRotationAngle = null;
        this._scrollRotationEnabled = false;
    }
};

/**
 * @scope enchant.Map.prototype
 * enchant.js v0.8.3 から抜粋
 */
enchant.Map = enchant.Class.create(enchant.Entity, {
    /**
     * @name enchant.Map
     * @class
     * A class to create and display maps from a tile set.
     * @param {Number} tileWidth Tile width.
     * @param {Number} tileHeight Tile height.
     * @constructs
     * @extends enchant.Entity
     */
    initialize: function (tileWidth, tileHeight) {
        var core = enchant.Core.instance;

        enchant.Entity.call(this);

        var surface = new enchant.Surface(core.width, core.height);
        this._surface = surface;
        var canvas = surface._element;
        canvas.style.position = 'absolute';
        if (enchant.ENV.RETINA_DISPLAY && core.scale === 2) {
            canvas.width = core.width * 2;
            canvas.height = core.height * 2;
            this._style.webkitTransformOrigin = '0 0';
            this._style.webkitTransform = 'scale(0.5)';
        } else {
            canvas.width = core.width;
            canvas.height = core.height;
        }
        this._context = canvas.getContext('2d');

        this._tileWidth = tileWidth || 0;
        this._tileHeight = tileHeight || 0;
        this._image = null;
        this._data = [
            [
                []
            ]
        ];
        this._dirty = false;
        this._tight = false;

        this.touchEnabled = false;

        /**
         * Two dimensional array to store if collision detection should be performed for a tile.
         * @type Number[][]
         */
        this.collisionData = null;

        this._listeners['render'] = null;
        this.addEventListener('render', function () {
            if (this._dirty) {
                this._previousOffsetX = this._previousOffsetY = null;
            }
        });
    },
    /**
     * Set map data.
     * Sets the tile data, whereas the data (two-dimensional array with indizes starting from 0) 
     * is mapped on the image starting from the upper left corner.
     * When more than one map data array is set, they are displayed in reverse order.
     * @param {...Number[][]} data Two-dimensional array of tile indizes. Multiple designations possible.
     */
    loadData: function (data) {
        this._data = Array.prototype.slice.apply(arguments);
        this._dirty = true;

        this._tight = false;
        for (var i = 0, len = this._data.length; i < len; i++) {
            var c = 0;
            data = this._data[i];
            for (var y = 0, l = data.length; y < l; y++) {
                for (var x = 0, ll = data[y].length; x < ll; x++) {
                    if (data[y][x] >= 0) {
                        c++;
                    }
                }
            }
            if (c / (data.length * data[0].length) > 0.2) {
                this._tight = true;
                break;
            }
        }
    },
    /**
     * Checks what tile is present at the given position.
     * @param {Number} x x coordinates of the point on the map.
     * @param {Number} y y coordinates of the point on the map.
     * @return {*} The tile data for the given position.
     */
    checkTile: function (x, y) {
        if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
            return false;
        }
        var width = this._image.width;
        var height = this._image.height;
        var tileWidth = this._tileWidth || width;
        var tileHeight = this._tileHeight || height;
        x = x / tileWidth | 0;
        y = y / tileHeight | 0;
        //		return this._data[y][x];
        var data = this._data[0];
        return data[y][x];
    },
    /**
     * Judges whether or not obstacles are on top of Map.
     * @param {Number} x x coordinates of detection spot on map.
     * @param {Number} y y coordinates of detection spot on map.
     * @return {Boolean} True, if there are obstacles.
     */
    hitTest: function (x, y) {
        if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
            return false;
        }
        var width = this._image.width;
        var height = this._image.height;
        var tileWidth = this._tileWidth || width;
        var tileHeight = this._tileHeight || height;
        x = x / tileWidth | 0;
        y = y / tileHeight | 0;
        if (this.collisionData != null) {
            return this.collisionData[y] && !!this.collisionData[y][x];
        } else {
            for (var i = 0, len = this._data.length; i < len; i++) {
                var data = this._data[i];
                var n;
                if (data[y] != null && (n = data[y][x]) != null &&
                    0 <= n && n < (width / tileWidth | 0) * (height / tileHeight | 0)) {
                    return true;
                }
            }
            return false;
        }
    },
    /**
     * Image with which the tile set is displayed on the map.
     * @type enchant.Surface
     */
    image: {
        get: function () {
            return this._image;
        },
        set: function (image) {
            var core = enchant.Core.instance;

            this._image = image;
            if (enchant.ENV.RETINA_DISPLAY && core.scale === 2) {
                var img = new enchant.Surface(image.width * 2, image.height * 2);
                var tileWidth = this._tileWidth || image.width;
                var tileHeight = this._tileHeight || image.height;
                var row = image.width / tileWidth | 0;
                var col = image.height / tileHeight | 0;
                for (var y = 0; y < col; y++) {
                    for (var x = 0; x < row; x++) {
                        img.draw(image, x * tileWidth, y * tileHeight, tileWidth, tileHeight,
                            x * tileWidth * 2, y * tileHeight * 2, tileWidth * 2, tileHeight * 2);
                    }
                }
                this._doubledImage = img;
            }
            this._dirty = true;
        }
    },
    /**
     * Map tile width.
     * @type Number
     */
    tileWidth: {
        get: function () {
            return this._tileWidth;
        },
        set: function (tileWidth) {
            if (this._tileWidth !== tileWidth) {
                this._tileWidth = tileWidth;
                this._dirty = true;
            }
        }
    },
    /**
     * Map tile height.
     * @type Number
     */
    tileHeight: {
        get: function () {
            return this._tileHeight;
        },
        set: function (tileHeight) {
            if (this._tileHeight !== tileHeight) {
                this._tileHeight = tileHeight;
                this._dirty = true;
            }
        }
    },
    /**
     * @private
     */
    width: {
        get: function () {
            return this._tileWidth * this._data[0][0].length;
        }
    },
    /**
     * @private
     */
    height: {
        get: function () {
            return this._tileHeight * this._data[0].length;
        }
    },
    /**
     * @private
     */
    redraw: function (x, y, width, height) {
        if (this._image == null) {
            return;
        }

        var image, tileWidth, tileHeight, dx, dy;
        if (this._doubledImage) {
            image = this._doubledImage;
            tileWidth = this._tileWidth * 2;
            tileHeight = this._tileHeight * 2;
            dx = -this._offsetX * 2;
            dy = -this._offsetY * 2;
            x *= 2;
            y *= 2;
            width *= 2;
            height *= 2;
        } else {
            image = this._image;
            tileWidth = this._tileWidth;
            tileHeight = this._tileHeight;
            dx = -this._offsetX;
            dy = -this._offsetY;
        }
        var row = image.width / tileWidth | 0;
        var col = image.height / tileHeight | 0;
        var left = Math.max((x + dx) / tileWidth | 0, 0);
        var top = Math.max((y + dy) / tileHeight | 0, 0);
        var right = Math.ceil((x + dx + width) / tileWidth);
        var bottom = Math.ceil((y + dy + height) / tileHeight);

        var source = image._element;
        var context = this._context;
        var canvas = context.canvas;
        context.clearRect(x, y, width, height);
        for (var i = 0, len = this._data.length; i < len; i++) {
            var data = this._data[i];
            var r = Math.min(right, data[0].length);
            var b = Math.min(bottom, data.length);
            for (y = top; y < b; y++) {
                for (x = left; x < r; x++) {
                    var n = data[y][x];
                    if (0 <= n && n < row * col) {
                        var sx = (n % row) * tileWidth;
                        var sy = (n / row | 0) * tileHeight;
                        context.drawImage(source, sx, sy, tileWidth, tileHeight,
                            x * tileWidth - dx, y * tileHeight - dy, tileWidth, tileHeight);
                    }
                }
            }
        }
    },
    /**
     * @private
     */
    updateBuffer: function () {
        if (this._visible === undefined || this._visible) {
            var core = enchant.Core.instance;
            if (this._dirty || this._previousOffsetX == null) {
                this.redraw(0, 0, core.width, core.height);
            } else if (this._offsetX !== this._previousOffsetX ||
                this._offsetY !== this._previousOffsetY) {
                if (this._tight) {
                    var x = -this._offsetX;
                    var y = -this._offsetY;
                    var px = -this._previousOffsetX;
                    var py = -this._previousOffsetY;
                    var w1 = x - px + core.width;
                    var w2 = px - x + core.width;
                    var h1 = y - py + core.height;
                    var h2 = py - y + core.height;
                    if (w1 > this._tileWidth && w2 > this._tileWidth &&
                        h1 > this._tileHeight && h2 > this._tileHeight) {
                        var sx, sy, dx, dy, sw, sh;
                        if (w1 < w2) {
                            sx = 0;
                            dx = px - x;
                            sw = w1;
                        } else {
                            sx = x - px;
                            dx = 0;
                            sw = w2;
                        }
                        if (h1 < h2) {
                            sy = 0;
                            dy = py - y;
                            sh = h1;
                        } else {
                            sy = y - py;
                            dy = 0;
                            sh = h2;
                        }

                        if (core._buffer == null) {
                            core._buffer = document.createElement('canvas');
                            core._buffer.width = this._context.canvas.width;
                            core._buffer.height = this._context.canvas.height;
                        }
                        var context = core._buffer.getContext('2d');
                        if (this._doubledImage) {
                            context.clearRect(0, 0, sw * 2, sh * 2);
                            context.drawImage(this._context.canvas,
                                sx * 2, sy * 2, sw * 2, sh * 2, 0, 0, sw * 2, sh * 2);
                            context = this._context;
                            context.clearRect(dx * 2, dy * 2, sw * 2, sh * 2);
                            context.drawImage(core._buffer,
                                0, 0, sw * 2, sh * 2, dx * 2, dy * 2, sw * 2, sh * 2);
                        } else {
                            context.clearRect(0, 0, sw, sh);
                            context.drawImage(this._context.canvas,
                                sx, sy, sw, sh, 0, 0, sw, sh);
                            context = this._context;
                            context.clearRect(dx, dy, sw, sh);
                            context.drawImage(core._buffer,
                                0, 0, sw, sh, dx, dy, sw, sh);
                        }

                        if (dx === 0) {
                            this.redraw(sw, 0, core.width - sw, core.height);
                        } else {
                            this.redraw(0, 0, core.width - sw, core.height);
                        }
                        if (dy === 0) {
                            this.redraw(0, sh, core.width, core.height - sh);
                        } else {
                            this.redraw(0, 0, core.width, core.height - sh);
                        }
                    } else {
                        this.redraw(0, 0, core.width, core.height);
                    }
                } else {
                    this.redraw(0, 0, core.width, core.height);
                }
            }
            this._previousOffsetX = this._offsetX;
            this._previousOffsetY = this._offsetY;
        }
    },
    cvsRender: function (ctx) {
        if (this.width !== 0 && this.height !== 0) {
            var core = enchant.Core.instance;
            this.updateBuffer();
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            var cvs = this._context.canvas;
            ctx.drawImage(cvs, 0, 0, core.width, core.height);
            ctx.restore();
        }
    },
    domRender: function (element) {
        if (this._image) {
            this.updateBuffer();
            this._style['background-image'] = this._surface._css;
            // bad performance
            this._style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'matrix(1, 0, 0, 1, 0, 0)';
        }
    }
});

/**
 * Map
 */
enchant.Map.prototype._init = enchant.Map.prototype.initialize;
enchant.Map.prototype.initialize = function (tileWidth, tileHeight) {
    this._init(tileWidth, tileHeight);
    this.childNodes = [];
    this.addEventListener('render', function () {
        for (var i = 0, l = this.childNodes.length; i < l; i++) {
            this.childNodes[i]._dirty = true;
        }
    });
};
enchant.Map.prototype.addChild = function (node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
    this.childNodes.push(node);
    node.parentNode = this;
    var childAdded = new enchant.Event('childadded');
    childAdded.node = node;
    childAdded.next = null;
    this.dispatchEvent(childAdded);
    node.dispatchEvent(new enchant.Event('added'));
    if (this.scene) {
        node.scene = this.scene;
        var addedToScene = new enchant.Event('addedtoscene');
        node.dispatchEvent(addedToScene);
    }
    node._dirty = true;
};
enchant.Map.prototype.removeChild = function (node) {
    var i;
    if ((i = this.childNodes.indexOf(node)) !== -1) {
        this.childNodes.splice(i, 1);
        node.parentNode = null;
        var childRemoved = new enchant.Event('childremoved');
        childRemoved.node = node;
        this.dispatchEvent(childRemoved);
        node.dispatchEvent(new enchant.Event('removed'));
        if (this.scene) {
            node.scene = null;
            var removedFromScene = new enchant.Event('removedfromscene');
            node.dispatchEvent(removedFromScene);
        }
    }
};
enchant.Map.prototype.setCenterNode = enchant.Group.prototype.setCenterNode;

enchant.Map.prototype.tileMapParser = function (title) {
    if (!TileMaps) throw new Error("TileMaps is undefined (Tiled Map Editor)");

    var _key;
    if (title) {
        _key = title;
    } else {
        _key = Object.keys(TileMaps)[0];
    }

    var _aryData = [];
    var _aryCollision = [];
    TileMaps[_key].layers.forEach(function (value, index) {
        if (value.type != "tilelayer") return;
        var _ary = [];
        for (var i = 0; i < value.height; i++) {
            var _ary2 = [];
            for (var j = 0; j < value.width; j++) {
                if (value.name == "collision") {
                    _ary2.push(value.data[value.width * i + j]);
                } else {
                    _ary2.push(value.data[value.width * i + j] - 1);
                }
            }
            _ary.push(_ary2);
        }
        if (value.name == "collision") {
            _aryCollision = _ary;
        } else {
            _aryData.push(_ary);
        }

    });
    this.loadData.apply(this, _aryData);
    this.collisionData = _aryCollision;
}

enchant.Map.prototype.parseMap = function (title, collision, visible = true) {
    if (!TileMaps) throw new Error("TileMaps is undefined (Tiled Map Editor)");

    var _collision = [];
    if (!collision) {
        _collision = ["collision"];
    } else if (collision instanceof Array) {
        collision.forEach(function (value, index) {
            _collision.push(value);
        });
    } else {
        _collision = [collision];
    }
    var _key;
    if (title) {
        _key = title;
    } else {
        _key = Object.keys(TileMaps)[0];
    }

    var tileWidth = TileMaps[_key].width;
    var tileHeight = TileMaps[_key].height;
    var _loadData = [];
    var _collisionData = new Array(tileHeight);
    for (var i = 0; i < _collisionData.length; i++) {
        _collisionData[i] = new Array(tileWidth).fill(0);
    }
    TileMaps[_key].layers.forEach(function (value, index) {
        //  judge(value);

        (function judge(value) {
            if (!value.visible) return;
            if (value.type == "tilelayer") {
                analyze(value);
            } else if (value.type == "group") {
                value.layers.forEach(function (value, index) {
                    judge(value);
                });
            }
        }(value));

        function analyze(value) {
            // 衝突オブジェクト判定
            // collisionでない場合、オフセットを(-1)とする
            var isCollision;
            var _offset = 0;
            if (_collision.indexOf(value.name) < 0) {
                isCollision = false;
                _offset = -1;
            } else {
                isCollision = true;
                _offset = 0;
            }
            var _height = value.height;
            var _width = value.width;
            var _startx = value.startx || 0;
            var _starty = value.starty || 0;

            // 初期化
            var _ary = new Array(_height + _starty);
            for (var i = 0; i < _ary.length; i++) {
                _ary[i] = new Array(_width + _startx).fill(_offset);
            }
            var dataAnalize = function (value) {
                var width = value.width;
                var height = value.height;
                var x = value.x;
                var y = value.y;
                value.data.forEach(function (value, index) {
                    var i = y + Math.floor(index / width);
                    var j = x + index % width;
                    if (isCollision)
                        if (_collisionData[i][j] == 0) _collisionData[i][j] = value;
                    if (visible) _ary[i][j] = value - 1;
                });
            }
            if (value.chunks) {
                value.chunks.forEach(function (value, index) {
                    dataAnalize(value)
                });
            } else {
                dataAnalize(value)
            }
            if (visible) _loadData.push(_ary);
        }

    });
    if (_loadData.length == 0) {
        var _arrayHeight = new Array(tileHeight);
        for (var i = 0; i < _arrayHeight.length; i++) {
            _arrayHeight[i] = new Array(tileWidth).fill(-1);
        }
        var _loadData = new Array(_arrayHeight);
    }
    this.loadData.apply(this, _loadData);
    if (_collisionData.length > 0) this.collisionData = _collisionData;
}

/**
 * Core
 */
enchant.TRANSITION = {
    NONE: "none",
    FADE: "fade",
    FADEOUT: "fadeout",
    FADEIN: "fadein",
};
window.TRANSITION = enchant.TRANSITION;
enchant.Core.prototype.replaceScene = function (scene, transition = TRANSITION.NONE, fadetime = 1000, fadecolor = "black") {
    var _popScene = TRANSITION.NONE;
    var _pushScene = TRANSITION.NONE;
    if (transition == TRANSITION.FADE) {
        _popScene = TRANSITION.FADEOUT;
        _pushScene = TRANSITION.FADEIN;
    } else if (transition == TRANSITION.FADEOUT) {
        _popScene = TRANSITION.FADEOUT;
    } else if (transition == TRANSITION.FADEIN) {
        _pushScene = TRANSITION.FADEIN;
    }
    var _this = this;
    this.popScene(_popScene, fadetime, fadecolor, function () {
        _this.pushScene(scene, _pushScene, fadetime, fadecolor);
    });
};
enchant.Core.prototype._pushScene = enchant.Core.prototype.pushScene;
enchant.Core.prototype.pushScene = function (scene, transition = TRANSITION.NONE, fadetime = 1000, fadecolor = "black", callback = function () { }) {
    if (transition == TRANSITION.NONE) {
        var ret = this._pushScene(scene);
        callback();
        return ret;
    } else {
        var _this = this;
        var fadeScene = new Scene();
        this._pushScene(fadeScene);
        var background = new Sprite(this.currentScene.width, this.currentScene.height);
        background.backgroundColor = fadecolor;
        background.opacity = 0;
        fadeScene.addChild(background);
        background.tl.setTimeBased();
        if (transition == TRANSITION.FADE || transition == TRANSITION.FADEOUT) {
            background.tl.fadeIn(fadetime);
        }
        background.tl.then(function () {
            _this._popScene();
            _this._pushScene(scene);
            _this.currentScene.addChild(background);
        });
        if (transition == TRANSITION.FADE || transition == TRANSITION.FADEIN) {
            background.tl.then(function () {
                background.opacity = 1;
            });
            background.tl.fadeOut(fadetime);
        }
        background.tl.then(function () {
            callback();
        });
        background.tl.removeFromScene();
    }
};
enchant.Core.prototype._popScene = enchant.Core.prototype.popScene;
enchant.Core.prototype.popScene = function (transition = TRANSITION.NONE, fadetime = 1000, fadecolor = "black", callback = function () { }) {
    if (transition == TRANSITION.NONE) {
        var ret = this._popScene();
        callback();
        return ret;
    } else {
        var _this = this;
        var fadeScene = new Scene();
        this._pushScene(fadeScene);
        var background = new Sprite(this.currentScene.width, this.currentScene.height);
        background.backgroundColor = fadecolor;
        background.opacity = 0;
        fadeScene.addChild(background);
        background.tl.setTimeBased();
        if (transition == TRANSITION.FADE || transition == TRANSITION.FADEOUT) {
            background.tl.fadeIn(fadetime);
        }
        background.tl.then(function () {
            _this._popScene();
            _this._popScene();
            _this.currentScene.addChild(background);
        });
        if (transition == TRANSITION.FADE || transition == TRANSITION.FADEIN) {
            background.tl.then(function () {
                background.opacity = 1;
            });
            background.tl.fadeOut(fadetime);
        }
        background.tl.then(function () {
            callback();
        });
        background.tl.removeFromScene();
    }
};
/**
 * addKeyDownEventListener
 *
 * @example
 * scene.addKeyDownEventListener("test", function() {
 *     console.log("dispatch KeyDown Event");
 * });
 */
enchant.Group.prototype.addKeyDownEventListener = function (text, callback, length = 255) {
    var _addKeyDownEventListener;
    var _keyDownHistoryText;
    if (!_addKeyDownEventListener) {
        _addKeyDownEventListener = function (e) {
            _keyDownHistoryText += e.key;
            if (_keyDownHistoryText.length > length) {
                _keyDownHistoryText = _keyDownHistoryText.slice(1);
            }
            var reg = new RegExp(text);
            if (_keyDownHistoryText.match(reg)) {
                _keyDownHistoryText = "";
                callback(e);
            }
        }
        _keyDownHistoryText = "";
    }
    if (this.scene) {
        this.scene.on(Event.ENTER, function () {
            window.addEventListener("keydown", _addKeyDownEventListener);
        });
        this.scene.on(Event.EXIT, function () {
            window.removeEventListener("keydown", _addKeyDownEventListener);
        });
    } else {
        window.addEventListener("keydown", _addKeyDownEventListener);
    }
}
enchant.Core.prototype.addKeyDownEventListener = enchant.Group.prototype.addKeyDownEventListener;
