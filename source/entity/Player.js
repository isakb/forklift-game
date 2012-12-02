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
                duration: 240,
                loop: true
            },
            shape: lychee.game.Entity.SHAPE.rectangle,
            collission: lychee.game.Entity.COLLISION.A,
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

            var newPosition = {
                x: this.__position.x + this.__speed.x * delta,
                y: this.__position.y + this.__speed.y * delta,
                z: this.__position.z
            };

            // TODO: check if new position is valid or collides

            this.__position = newPosition;
        },

        __fall: function() {
            var newSpeed = {
                x: this.__speed.x,
                // gravity
                y: this.__speed.y + 0.01
            };
            this.__speed = newSpeed;
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
            var direction = this.__state === 'left' ? -1 : 1;
            console.log('SHOOTING');
            if (this.game.settings.sound) {
                this.game.jukebox.play('fork', 0.5);
            }
            this.__world.shootFork(this.getPosition(), direction);


        }

    };


    return Class;

});
