/*global lychee */

lychee.define('game.entity.Player').requires([
    'lychee.game.Entity'
]).includes([
    'lychee.ui.Sprite'
]).exports(function(lychee, global) {

    var Class = function(game, owner) {

        this.__lastStateId = null;

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

        this.__world = owner;

        this.__speed = {
            x: 0,
            y: 0
        };


    };


    Class.prototype = {


        update: function(clock, delta) {

            lychee.ui.Sprite.prototype.update.call(this, clock, delta);

            // Is falling or has jumped?
            if (this.__isFalling) {
                this.__fall();
            }

            var pos = this.__position;

            // TODO: check if new position is valid or collides
            //
            pos.x = this.__position.x + this.__speed.x * delta;
            pos.y = this.__position.y + this.__speed.y * delta;

            // The world is "infinite" but repeating in y-axis.
            if (this.__position.y > 15000) {
                console.log('warping');
                this.__position.y = -15000 + (this.__position.y - 15000);
            } else if (this.__position.y < -15000) {
                console.log('warping');
                this.__position.y = 15000 - (this.__position.y + 15000);
            }

        },

        __fall: function() {
            this.__speed.y = (this.__speed.y + 0.015) * 0.99;
        },

        __checkIfCollidesWithGroundEntity: function(groundEntity) {
            // If currently flying up, don't attempt to collide with ground:
            if (this.__speed.y < 0) {
                return;
            }

            if (this.collidesWith(groundEntity)) {
                this.__isFalling = false;
                this.__speed.y = 0;
            }
        },

        __checkIfCollidesWithEnemy: function(enemy) {
            return this.collidesWith(enemy);
        },


        goLeft: function() {
            if (this.__speed.x < -0.5) return;

            this.__speed.x -= 0.05;

            if (this.__speed.x < 0) {
                this.setState('left');
            }
        },

        goRight: function() {
            if (this.__speed.x > 0.5) return;

            this.__speed.x += 0.05;

            if (this.__speed.x > 0) {
                this.setState('right');
            }
        },

        goUp: function() {
            if (this.__isFalling) {
                return;
            }
            this.__isFalling = true;
            this.__speed.y = -0.4; // impulse jump

            if (this.game.settings.sound) {
                this.game.jukebox.play('thump', 0.2);
            }
        },

        goDown: function() {
            this.__speed.y += 0.2;
        },

        shoot: function() {
            var direction = this.__state === 'left' ? -1 : 1,
                position = this.getPosition();

            console.log('SHOOTING');

            if (this.game.settings.sound) {
                this.game.jukebox.play('fork', 0.5);
            }

            this.__world.spawnFork({
                x: position.x,
                y: position.y
            }, {
                x: this.__speed.x,
                y: this.__speed.y
            }, this.__state);

        }

    };


    return Class;

});
