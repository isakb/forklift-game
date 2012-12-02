/*global lychee _ */

lychee.define('game.entity.Fork').requires([
    'lychee.game.Entity'
]).includes([
    'lychee.ui.Sprite'
]).exports(function(lychee, global) {

    var Class = function(settings, game) {

        this.__lastStateId = null;

        this.game = game;

        lychee.ui.Sprite.call(this, _.merge({
            animation: {
                frame: 0,
                frames: 2,
                duration: 150,
                loop: true
            },
            shape: lychee.game.Entity.SHAPE.circle,
            collission: lychee.game.Entity.COLLISION.A,
            state: settings.dx > 0 ? 'right' : 'left'

        }, game.config.fork, settings));

        this.__speed = {
            x: settings.dx,
            y: settings.dy
        };

        this.__fly();

    };


    Class.prototype = {


        update: function(clock, delta) {

            lychee.ui.Sprite.prototype.update.call(this, clock, delta);

            this.__fly();

            this.__position.x += this.__speed.x * delta;
            this.__position.y += this.__speed.y * delta;
        },

        __fly: function() {
            this.__speed.x *= 1.02; // use the fork, luke
            this.__speed.y = (this.__speed.y + 0.02) * 0.99;
        },

        __checkIfCollidesWithEnemy: function(enemy) {
            return this.collidesWith(enemy);
        }


    };


    return Class;

});
