/*global lychee _ */

lychee.define('game.entity.Fork').requires([
    'lychee.game.Entity'
]).includes([
    'lychee.ui.Sprite'
]).exports(function(lychee, global) {

    var Class = function(settings, game) {

        this._lastStateId = null;

        this.game = game;

        lychee.ui.Sprite.call(this, _.merge({
            animation: {
                frame: 0,
                frames: 2,
                duration: 150,
                loop: true
            },
            shape: lychee.game.Entity.SHAPE.circle,
            collision: lychee.game.Entity.COLLISION.A,
            state: settings.direction

        }, game.config.fork, settings));

        this._speed = settings.speed;

        this._fly();

    };


    Class.prototype = {


        update: function(clock, delta) {

            lychee.ui.Sprite.prototype.update.call(this, clock, delta);

            this._fly();

            this._position.x += this._speed.x * delta;
            this._position.y += this._speed.y * delta;
        },

        _fly: function() {
            this._speed.x *= 50 / (50 + this._speed.x * this._speed.x);
            this._speed.y = (this._speed.y + 0.02) * 0.99;
        },

        _checkIfCollidesWithEnemy: function(enemy) {
            return this.collidesWith(enemy);
        }


    };


    return Class;

});
