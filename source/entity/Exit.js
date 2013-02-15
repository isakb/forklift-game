/*global lychee */

lychee.define('game.entity.Exit').includes([
    'lychee.game.Sprite'
]).exports(function(lychee, global) {

    var Class = function(settings) {

        this._lastStateId = null;

        lychee.game.Sprite.call(this, settings);

        this._shape = lychee.game.Entity.SHAPE.rectangle;

        this._collision = lychee.game.Entity.COLLISION.A;

    };


    Class.prototype = {


    };


    return Class;

});
