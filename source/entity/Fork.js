/*global lychee */

lychee.define('game.entity.Fork').requires([
    'lychee.game.Entity'
]).includes([
    'lychee.game.Sprite'
]).exports(function(lychee, global) {

    var Class = function(settings, game) {

        this.__lastStateId = null;

        this.game = game;

        lychee.game.Sprite.call(this, settings);

        this.__shape = lychee.game.Entity.SHAPE.circle;

        this.__collision = lychee.game.Entity.COLLISION.A;

        this.__image = game.config.fork.image;
        this.__states = game.config.fork.states;
        this.__map = game.config.fork.map;

        this.__state = 'right';


        this.__speed = {
            x: 0,
            y: 0
        };

        this.__animation = {
            frame: 0,
            frames: 2,
            duration: 100,
            loop: true
        };


        this.__fly();

    };


    Class.prototype = {


        update: function(clock, delta) {
            var newPosition = {
                x: this.__position.x + this.__speed.x * delta,
                y: this.__position.y + this.__speed.y * delta,
                z: this.__position.z
            };

            // TODO: check if new position is valid or collides

            this.__position = newPosition;
        },

        __fly: function() {
            var newSpeed = {
                x: this.__speed.x * 0.9,
                // gravity
                y: this.__speed.y + 0.01
            };
            this.__speed = newSpeed;
        },

        __checkIfCollidesWithEnemy: function(enemy) {
            return this.collidesWith(enemy);
        },


    };


    return Class;

});
