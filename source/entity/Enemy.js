/*global lychee */

lychee.define('game.entity.Enemy').includes([
    'lychee.game.Sprite'
]).exports(function(lychee, global) {

    var Class = function(settings) {

        this._lastStateId = null;

        lychee.game.Sprite.call(this, settings);

    };


    Class.prototype = {


    };


    return Class;

});
