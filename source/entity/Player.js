/*global lychee */

lychee.define('game.entity.Player').requires([
    'lychee.game.Entity'
]).includes([
    'lychee.ui.Sprite'
]).exports(function(lychee, global) {

    var Class = function(game, owner) {

        this._lastStateId = null;

        this.game = game;

        lychee.game.Sprite.call(this, _.merge({
            animation: {
                frame: 0,
                frames: 4,
                duration: 280,
                loop: true
            },
            shape: lychee.game.Entity.SHAPE.rectangle,
            collision: lychee.game.Entity.COLLISION.A,
            state: 'right'

        }, game.config.player));


        var playerConfig = game.config.player;

        this._world = owner;

        this._speed = {
            x: 0,
            y: 0
        };


    };


    Class.prototype = {


        update: function(clock, delta) {

            lychee.ui.Sprite.prototype.update.call(this, clock, delta);

            // Is falling or has jumped?
            if (this._isFalling) {
                this._fall();
            }

            var pos = this._position;

            // TODO: check if new position is valid or collides
            //
            pos.x = this._position.x + this._speed.x * delta;
            pos.y = this._position.y + this._speed.y * delta;

            // The world is "infinite" but repeating in y-axis.
            if (this._position.y > 15000) {
                console.log('warping');
                this._position.y = -15000 + (this._position.y - 15000);
            } else if (this._position.y < -15000) {
                console.log('warping');
                this._position.y = 15000 - (this._position.y + 15000);
            }

        },

        _fall: function() {
            this._speed.y = (this._speed.y + 0.015) * 0.99;
        },

        _checkIfCollidesWithGroundEntity: function(groundEntity) {
            // If currently flying up, don't attempt to collide with ground:
            if (this._speed.y < 0) {
                return;
            }

            if (this.collidesWith(groundEntity)) {
                this._isFalling = false;
                this._speed.y = 0;
            }
        },

        _checkIfCollidesWithEnemy: function(enemy) {
            return this.collidesWith(enemy);
        },


        goLeft: function() {
            if (this._speed.x < -0.5) return;

            this._speed.x -= 0.05;

            if (this._speed.x < 0) {
                this.setState('left');
            }
        },

        goRight: function() {
            if (this._speed.x > 0.5) return;

            this._speed.x += 0.05;

            if (this._speed.x > 0) {
                this.setState('right');
            }
        },

        goUp: function() {
            if (this._isFalling) {
                return;
            }
            this._isFalling = true;
            this._speed.y = -0.4; // impulse jump

            if (this.game.settings.sound) {
                this.game.jukebox.play('thump', 0.2);
            }
        },

        goDown: function() {
            this._speed.y += 0.2;
        },

        shoot: function() {
            var direction = this._state === 'left' ? -1 : 1,
                position = this.getPosition();

            console.log('SHOOTING');

            if (this.game.settings.sound) {
                this.game.jukebox.play('fork', 0.5);
            }

            this._world.spawnFork({
                x: position.x,
                y: position.y
            }, {
                x: this._speed.x,
                y: this._speed.y
            }, this._state);

        }

    };


    return Class;

});
