define([
    ],
    function(
    ) {

        var Vector2 = function(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        };

        Vector2.prototype = {
            constructor: Vector2,

            length: function () {
                return Math.sqrt( this.x * this.x + this.y * this.y );
            },

            lengthSquared: function () {
                return this.x * this.x + this.y * this.y;
            },

            normalize: function () {
                var length = this.length();
                this.x = this.x / length;
                this.y = this.y / length;
            },

            equals: function( v ) {
                return (( v.x === this.x ) && ( v.y === this.y ));
            },

            clone: function() {
                return new Vector2(this.x, this.y);
            },

            isValid: function() {
                return !(isNaN(this.x) || isNaN(this.y));
            },

            toArray: function() {
                return [this.x, this.y];
            },

            toString: function() {
                return '[ ' + this.x + ', ' + this.y + ' ]';
            }
        };

        Vector2.clone = function(vector) {
            return new Vector2(vector.x, vector.y);
        };

        Vector2.add = function(a, b, result) {
            result.x = a.x + b.x;
            result.y = a.y + b.y;
        };

        Vector2.subtract = function(a, b, result) {
            result.x = a.x - b.x;
            result.y = a.y - b.y;
        };

        Vector2.multiply = function(a, b, result) {
            result.x = a.x * b.x;
            result.y = a.y * b.y;
        };

        Vector2.divide = function(a, b, result) {
            result.x = a.x / b.x;
            result.y = a.y / b.y;
        };

        Vector2.addScalar = function(v, s, result) {
            result.x = v.x + s;
            result.y = v.y + s;
        };

        Vector2.subtractScalar = function(v, s, result) {
            result.x = a.x - s;
            result.y = a.y - s;
        };

        Vector2.multiplyScalar = function(v, s, result) {
            result.x = a.x * s;
            result.y = a.y * s;
        };

        Vector2.divideScalar = function(v, s, result) {
            result.x = a.x / s;
            result.y = a.y / s;
        };

        Vector2.min = function(a, b, result) {
            if (a.x < b.x) {
                result.x = a.x;
            }
            if (a.y < b.y) {
                result.y = a.y;
            }
        };

        Vector2.max = function(a, b, result) {
            if (a.x > b.x) {
                result.x = a.x;
            }
            if (a.y > b.y) {
                result.y = a.y;
            }
        };

        Vector2.clamp = function(min, max, val, result) {
            if ( val.x < min.x ) {
                result.x = min.x;
            } else if ( val.x > max.x ) {
                result.x = max.x;
            }
            if ( val.y < min.y ) {
                result.y = min.y;
            } else if ( val.y > max.y ) {
                result.y = max.y;
            }
        };

        Vector2.dot = function(a, b) {
            return a.x * b.x + a.y * b.y;
        };

        Vector2.lerp = function(a, b, amount, result) {
            result.x = a.x + ( b.x - a.x ) * amount;
            result.y = a.y + ( b.y - a.y ) * amount;
        };

        Vector2.distanceSquared = function(a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            return dx * dx + dy * dy;
        };

        Vector2.distance = function(a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            return Math.sqrt(dx * dx + dy * dy);
        };

        return Vector2;
    }
);
