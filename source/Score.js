/*global lychee */

lychee.define('game.Score').includes([
    'lychee.Events'
]).exports(function(lychee, global) {

    var Class = function() {

        this._data = {
            points: 0,
            time:   0
        };

        lychee.Events.call(this, 'score');

    };


    Class.prototype = {

        get: function(key) {

            if (key === undefined) {
                return this._data;
            } else {
                return this._data[key] || null;
            }

        },

        set: function(key, value) {

            this._data[key] = value;
            this.trigger('update', [ this._data ]);

        },

        add: function(key, value) {

            value = typeof value === 'number' ? value : 0;

            if (this._data[key] === undefined) {
                this._data[key] = 0;
            }

            this._data[key] += value;
            this.trigger('update', [ this._data ]);

        },

        subtract: function(key, value) {

            value = typeof value === 'number' ? value : 0;

            if (this._data[key] === undefined) {
                this._data[key] = 0;
            }

            this._data[key] -= value;
            this.trigger('update', [ this._data ]);

        }

    };


    return Class;

});
