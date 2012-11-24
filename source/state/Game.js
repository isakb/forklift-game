/*global lychee */

lychee.define('game.state.Game').includes([
    'lychee.game.State'
]).exports(function(lychee, global) {

    var Class = function(game) {

        lychee.game.State.call(this, game, 'menu');

        this.__input = this.game.input;
        this.__loop = this.game.loop;
        this.__renderer = this.game.renderer;

        this.__clock = 0;
        this.__entities = {};
        this.__locked = false;

        this.reset();

    };


    Class.prototype = {

        reset: function() {

            var width = this.game.settings.width;
            var height = this.game.settings.height;

            this.__entities.intro = new lychee.ui.Text({
                text: 'The first day',
                font: this.game.fonts.normal,
                position: {
                    x: width / 2,
                    y: -200
                }
            });


            this.__entities.noisehint = new lychee.ui.Text({
                text: 'Survive until the coffee break',
                font: this.game.fonts.small,
                position: {
                    x: width / 2,
                    y: height + 24
                }
            });

            var image = this.game.config.sprite.image;
            var states = this.game.config.sprite.states;
            var map = this.game.config.sprite.map;

            this.__entities.player = this.player = new lychee.ui.Sprite({
                image: this.game.config.player.image,
                states: this.game.config.player.states,
                map: this.game.config.player.map,
                position: {
                    x: width / 2 - 84,
                    y: height / 2
                },
                state: 'right',
                animation: {
                    frame: 0,
                    frames: 4,
                    duration: 240,
                    loop: true
                }
            });

            this.__entities.spriteA = new lychee.ui.Sprite({
                image: image,
                states: states,
                map: map,
                position: {
                    x: width / 2 - 84,
                    y: height / 2
                },
                state: 'first',
                animation: {
                    frame: 0,
                    frames: 6,
                    duration: 24000,
                    loop: true
                }
            });

            this.__entities.spriteB = new lychee.ui.Sprite({
                image: image,
                states: states,
                map: map,
                position: {
                    x: width / 2 - 42,
                    y: height / 2
                },
                state: 'second',
                animation: {
                    frame: 0,
                    frames: 6,
                    duration: 12000,
                    loop: true
                }
            });

            this.__entities.spriteC = new lychee.ui.Sprite({
                image: image,
                states: states,
                map: map,
                position: {
                    x: width / 2,
                    y: height / 2
                },
                state: 'third',
                animation: {
                    frame: 0,
                    frames: 6,
                    duration: 6000,
                    loop: true
                }
            });

            this.__entities.spriteD = new lychee.ui.Sprite({
                image: image,
                states: states,
                map: map,
                position: {
                    x: width / 2 + 42,
                    y: height / 2
                },
                state: 'fourth',
                animation: {
                    frame: 0,
                    frames: 6,
                    duration: 3000,
                    loop: true
                }
            });

            this.__entities.spriteE = new lychee.ui.Sprite({
                image: image,
                states: states,
                map: map,
                position: {
                    x: width / 2 + 84,
                    y: height / 2
                },
                state: 'fifth',
                animation: {
                    frame: 0,
                    frames: 6,
                    duration: 1000,
                    loop: true
                }
            });

        },

        enter: function() {

            lychee.game.State.prototype.enter.call(this);

            this.__locked = true;


            var width = this.game.settings.width;
            var height = this.game.settings.height;

            this.__entities.intro.setPosition({
                x: width / 2,
                y: -200
            });

            this.__entities.noisehint.setPosition({
                x: width / 2,
                y: height + 24
            });

            this.__entities.intro.setTween(1500, {
                y: height / 2 - 50
            }, lychee.game.Entity.TWEEN.easeOut);

            this.__loop.timeout(1000, function() {

                this.__locked = false;

                this.__entities.noisehint.setTween(500, {
                    y: height / 2 + 50
                }, lychee.game.Entity.TWEEN.easeOut);

            }, this);

            if (this.game.settings.music) {
                this.game.jukebox.play('music', true, 0.7);
            }

            this.__input.bind('touch', this.__processTouch, this);

            this.__input.bind('left', this.__onKeyLeft, this);
            this.__input.bind('right', this.__onKeyRight, this);
            this.__input.bind('up', this.__onKeyUp, this);
            this.__input.bind('down', this.__onKeyDown, this);

            this.__input.bind('space', this.__onKeySpace, this);

            this.__renderer.start();

        },

        leave: function() {

            this.__renderer.stop();
            this.__input.unbind('touch', this.__processTouch);


            lychee.game.State.prototype.leave.call(this);

        },

        update: function(clock, delta) {

            for (var e in this.__entities) {
                if (this.__entities[e] === null) continue;
                this.__entities[e].update(clock, delta);
            }

            this.__clock = clock;

        },

        render: function(clock, delta) {

            this.__renderer.clear();


            for (var e in this.__entities) {
                if (this.__entities[e] === null) continue;
                this.__renderer.renderUIEntity(this.__entities[e]);
            }


            this.__renderer.flush();

        },

        __processTouch: function(position, delta) {

            if (this.__locked) return;

            var offset = this.game.getOffset();

            position.x -= offset.x;
            position.y -= offset.y;


            var entity = this.__getEntityByPosition(position.x, position.y);
            if (entity !== null) {
                entity.trigger('touch', [ entity ]);
            }


            if (this.game.settings.sound) {
                this.game.jukebox.play('click');
            }

        },

        __onKeyLeft: function(position, delta) {

            if (this.player.state === 'left') return;

            this.player.setState('left');

            if (this.game.settings.sound) {
                this.game.jukebox.play('click', 0.3);
            }

        },

        __onKeyRight: function(position, delta) {

            if (this.player.state === 'right') return;

            this.player.setState('right');

            if (this.game.settings.sound) {
                this.game.jukebox.play('click', 0.3);
            }

        },


        __getEntityByPosition: function(x, y) {

            var found = null;

            for (var e in this.__entities) {

                if (this.__entities[e] === null) continue;

                var entity = this.__entities[e];
                var position = entity.getPosition();

                if (
                    x >= position.x - entity.width / 2 &&
                    x <= position.x + entity.width / 2 &&
                    y >= position.y - entity.height / 2 &&
                    y <= position.y + entity.height / 2
                ) {
                    found = entity;
                    break;
                }


            }


            return found;

        }

    };


    return Class;

});
