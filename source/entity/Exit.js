/*global lychee */

lychee.define('game.entity.Exit').includes([
    'lychee.game.Sprite'
]).exports(function(lychee, global) {

    var Class = function(settings) {

        this.__lastStateId = null;

        lychee.game.Sprite.call(this, settings);

        this.__shape = lychee.game.Entity.SHAPE.rectangle;

        this.__collision = lychee.game.Entity.COLLISION.A;

    };


    Class.prototype = {


    };


    return Class;

});
