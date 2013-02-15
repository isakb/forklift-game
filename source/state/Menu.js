/*global lychee game */

lychee.define('game.state.Menu').requires([
    'game.Scene'
]).includes([
    'lychee.game.State'
]).exports(function(lychee, global) {

    var Class = function(game) {

        lychee.game.State.call(this, game, 'menu');

        this._input = this.game.input;

        this._renderer = this.game.renderer;

        this._locked = true;
        this._scene = null;

        this._welcome = null;
        this._settings = null;


        this.reset();

    };


    Class.prototype = {

        reset: function() {

            var hwidth  = this.game.settings.width / 2;
            var hheight = this.game.settings.height / 2;
            var entity = null;


            this._scene = new game.Scene(this.game);


            this._welcome = this._scene.add(new lychee.ui.Tile({
                width: this.game.settings.width,
                height: this.game.settings.height,
                position: {
                    x: hwidth,
                    y: hheight
                }
            }), null);

            this._scene.add(new lychee.ui.Text({
                text: this.game.settings.title,
                font: this.game.fonts.headline,
                layout: {
                    position: 'absolute',
                    x: 0,
                    y: -hheight + 80
                }
            }), this._welcome);

            this._scene.add(new lychee.ui.Text({
                text: 'powered by lycheeJS',
                font: this.game.fonts.small,
                layout: {
                    position: 'absolute',
                    x: 0,
                    y: hheight - 30
                }
            }), this._welcome);

            entity = new lychee.ui.Text({
                text: 'Start Game',
                font: this.game.fonts.normal,
                layout: {
                    position: 'absolute',
                    x: 0,
                    y: -24
                }
            });

            entity.bind('touch', function(entity) {
                this.game.setState('game');
            }, this);

            this._scene.add(entity, this._welcome);

            entity = new lychee.ui.Text({
                text: 'Settings',
                font: this.game.fonts.normal,
                layout: {
                    position: 'absolute',
                    x: 0,
                    y: 24
                }
            });

            entity.bind('touch', function(entity) {
                this._scene.scrollTo(this._settings);
            }, this);

            this._scene.add(entity, this._welcome);





            this._settings = this._scene.add(new lychee.ui.Tile({
                width: this.game.settings.width,
                height: this.game.settings.height,
                position: {
                    x: hwidth * 3,
                    y: hheight
                }
            }), null);

            entity = new lychee.ui.Text({
                text: 'Settings',
                font: this.game.fonts.headline,
                layout: {
                    position: 'absolute',
                    x: 0,
                    y: -hheight + 80
                }
            });

            entity.bind('touch', function(entity) {
                this._scene.scrollTo(this._welcome);
            }, this);

            this._scene.add(entity, this._settings);

            // entity = new lychee.ui.Text({
            //     text: 'Fullscreen: ' + (this.game.settings.fullscreen ? 'On' : 'Off'),
            //     font: this.game.fonts.normal,
            //     layout: {
            //         position: 'absolute',
            //         x: 0,
            //         y: -24
            //     }
            // });

            // entity.bind('touch', function(entity) {

            //     this.game.settings.fullscreen = this.game.settings.fullscreen ? false : true;

            //     entity.set('Fullscreen: ' + (this.game.settings.fullscreen ? 'On' : 'Off'));

            //     this.game.reset();
            //     this.reset();

            //     this._scene.scrollTo(this._settings);

            // }, this);

            // this._scene.add(entity, this._settings);

            entity = new lychee.ui.Text({
                text: 'Music: ' + (this.game.settings.music ? 'On' : 'Off'),
                font: this.game.fonts.normal,
                layout: {
                    position: 'absolute',
                    x: 0,
                    y: 24
                }
            });

            entity.bind('touch', function(entity) {

                this.game.settings.music = this.game.settings.music ? false : true;

                entity.set('Music: ' + (this.game.settings.music ? 'On' : 'Off'));

            }, this);

            this._scene.add(entity, this._settings);

            entity = new lychee.ui.Text({
                text: 'Sound: ' + (this.game.settings.sound ? 'On' : 'Off'),
                font: this.game.fonts.normal,
                layout: {
                    position: 'absolute',
                    x: 0,
                    y: 72
                }
            });

            entity.bind('touch', function(entity) {

                this.game.settings.sound = this.game.settings.sound ? false : true;

                entity.set('Sound: ' + (this.game.settings.sound ? 'On' : 'Off'));

            }, this);

            this._scene.add(entity, this._settings);


        },

        enter: function() {

            lychee.game.State.prototype.enter.call(this);

            this._locked = true;

            this._scene.scrollTo(this._welcome, function() {
                this._locked = false;
            }, this);

            this._input.bind('touch', this._processTouch, this);
            this._renderer.start();

        },

        leave: function() {

            this._renderer.stop();
            this._input.unbind('touch', this._processTouch);

            lychee.game.State.prototype.leave.call(this);

        },

        update: function(clock, delta) {

            if (this._scene !== null) {
                this._scene.update(clock, delta);
            }

        },

        render: function(clock, delta) {

            this._renderer.clear();

            if (this._scene !== null) {
                this._scene.render(clock, delta);
            }

            this._renderer.flush();

        },

        _processTouch: function(id, position, delta) {

            if (this._locked) return;

            var gameOffset = this.game.getOffset();

            position.x -= gameOffset.x;
            position.y -= gameOffset.y;


            var entity = this._scene.getEntityByPosition(position.x, position.y, null, true);
            if (entity !== null) {

                if (this.game.settings.sound) {
                    this.game.jukebox.play('click');
                }

                entity.trigger('touch', [ entity ]);

            }

        }

    };


    return Class;

});

