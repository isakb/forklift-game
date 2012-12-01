/*global lychee game _ console*/

lychee.define('game.state.Game').requires([
    'lychee.game.Sprite',
    'game.entity.Player',
    'game.entity.Enemy',
    'game.entity.Fork',
    'game.entity.Exit'
]).includes([
    'lychee.game.State'
]).exports(function(lychee, global) {

    var Class = function(game) {

        lychee.game.State.call(this, game, 'menu');

        this.__input = this.game.input;
        this.__loop = this.game.loop;
        this.__renderer = this.game.renderer;

        this.__clock = 0;
        this.__skyboxEntity = null;
        this.__backgroundEntity = null;
        this.__entities = {};
        this.__player = null;
        this.__forks = [];
        this.__exit = null;
        this.__locked = false;

        this.reset();

    };


    Class.prototype = {

        reset: function() {

            this.__level = '01';

            var width = this.game.settings.width;
            var height = this.game.settings.height;

            var image = this.game.config.sprite.image;
            var states = this.game.config.sprite.states;
            var map = this.game.config.sprite.map;

        },

        enter: function() {

            lychee.game.State.prototype.enter.call(this);

            this.__locked = true;

            this.__enterLevel(this.__level);

            var width = this.game.settings.width;
            var height = this.game.settings.height;

            if (this.game.settings.music) {
                this.game.jukebox.play('music', true, 0.7);
            }

            this.__input.bind('left', this.__onKeyLeft, this);
            this.__input.bind('right', this.__onKeyRight, this);
            this.__input.bind('up', this.__onKeyUp, this);
            this.__input.bind('down', this.__onKeyDown, this);

            this.__input.bind('space', this.__onKeySpace, this);

            this.__renderer.start();

        },

        leave: function() {

            this.__renderer.stop();
            this.__input.unbind('left', this.__onKeyLeft);
            this.__input.unbind('right', this.__onKeyRight);
            this.__input.unbind('up', this.__onKeyUp);
            this.__input.unbind('down', this.__onKeyDown);

            this.__input.unbind('space', this.__onKeySpace);

            lychee.game.State.prototype.leave.call(this);

        },

        update: function(clock, delta) {


            this.__player.update(clock, delta);

            for (var e in this.__entities) {
                if (this.__entities[e] === null) continue;
                this.__entities[e].update(clock, delta);
            }

            this.__clock = clock;

        },

        render: function(clock, delta) {

            var entity;

            this.__renderer.clear();

            this.__renderer.moveCameraTo(this.__player);

            this.__renderer.renderParallaxBackground(this.__skyboxEntity, this.__player);

            this.__renderer.renderParallaxBackground(this.__backgroundEntity, this.__player);


            for (var layer in this.__layers) {
                this.__renderer.renderLayer(this.__layers[layer]);
            }

            this.__renderer.renderPlayer(this.__player);

            for (var e in this.__entities) {
                entity = this.__entities[e];

                if (entity === null) {
                    continue;
                } else if (entity.type) {
                    this.__renderer['render' + entity.type](entity);
                } else {
                    this.__renderer.renderUIEntity(this.__entities[e]);
                }
            }

            this.__renderer.flush();

        },


        __enterLevel: function(level) {

            var levelConfig = this.game.config.levels[level];

            console.log('Making level %s (%s)', level, levelConfig.properties.title);

            var assets = this.game.assets;

            var LEVEL_IMG_PREFIX = './asset/img/l';

            var width = this.game.settings.width;
            var height = this.game.settings.height;

            var tileImage = assets[LEVEL_IMG_PREFIX + level + '/tiles.png'];

            this.__skyboxEntity = new lychee.game.Sprite({
                image: assets[LEVEL_IMG_PREFIX + level + '/bg1.png']
            });
            this.__skyboxEntity.parallax = 0.05;

            this.__backgroundEntity = new lychee.game.Sprite({
                image: assets[LEVEL_IMG_PREFIX + level + '/bg2.png']
            });
            this.__backgroundEntity.parallax = 0.2;

            this.__exit = new game.entity.Exit();

            this.__player = new game.entity.Player({
                image: this.game.config.player.image,
                state: this.game.config.player.states,
                map: this.game.config.player.map
            }, this.game, this);

            var tileWidth = levelConfig.tilewidth;
            var tileHeight = levelConfig.tileheight;
            var tileSets = levelConfig.tilesets;
            var layers = levelConfig.layers;

            _.each(layers, function(layer) {
                this.__makeLayer(layer);
            }, this);

            this.__locked = false;

            this.__entities.title = new lychee.ui.Text({
                text: levelConfig.properties.title,
                font: this.game.fonts.normal,
                position: {
                    x: width / 2,
                    y: -200
                }
            });

            this.__entities.description = new lychee.ui.Text({
                text: levelConfig.properties.description,
                font: this.game.fonts.small,
                position: {
                    x: width / 2,
                    y: height + 24
                }
            });

            this.__entities.title.setTween(1500, {
                y: height / 2 - 100
            }, lychee.game.Entity.TWEEN.easeOut);

            this.__loop.timeout(1000, function() {
                this.__entities.description.setTween(500, {
                    y: height / 2 + 100
                }, lychee.game.Entity.TWEEN.easeOut);

            }, this);

            this.__loop.timeout(3000, function() {
                this.__entities.title.setTween(500, {
                    x: -1000
                }, lychee.game.Entity.TWEEN.easeIn);

                this.__entities.description.setTween(500, {
                    x: -1000
                }, lychee.game.Entity.TWEEN.easeIn);

            }, this);

        },

        __makeLayer: function(layer) {

            switch(layer.type) {
                case 'tilelayer':
                    if (layer.name === 'collision') {
                        this.__collisionLayer = layer.data;
                    }
                    break;

                case 'objectgroup':
                    if (layer.name === 'enemy_entities') {
                        this.__addEnemies(layer.objects);
                    } else if (layer.name === 'entities') {
                        this.__addEntities(layer.objects);
                    }
                    break;

                default:
                    console.info('Ignoring layer: ' + layer.name);
            }


        },

        __addEntities: function(entities) {
            _.each(entities, function(entity) {
                if (entity.type === 'Player') {
                    this.__player.setPosition({x: entity.x, y: entity.y});
                } else if (entity.type === 'Exit') {
                    // Let's limit it to one exit per level for now.
                    this.__exit.setPosition({x: entity.x, y: entity.y});
                } else {
                    console.warn('Ignored map entity: ' + entity.type);
                }

            }, this);
        },

        __addEnemies: function(entities) {
            _.each(entities, function(entity) {
                var Klass = game.entity[entity.type];
                this.__entities[entity.name] = new Klass(entity.properties);

            }, this);
        },

        shootFork: function(position, addSpeed) {
            this.__forks.push(new game.entity.Fork({
                x: position.x,
                y: position.y,
                dx: addSpeed.x * 4,
                dy: addSpeed.y
            }, this.game));
        },


        __onKeyLeft: function(position, event) {
            event.preventDefault();
            this.__player.goLeft();
        },

        __onKeyRight: function(position, event) {
            event.preventDefault();
            this.__player.goRight();
        },

        __onKeyUp: function(position, event) {
            event.preventDefault();
            this.__player.goUp();
        },

        __onKeyDown: function(position, event) {
            event.preventDefault();
            this.__player.goDown();
        },

        __onKeySpace: function(position, event) {
            event.preventDefault();
            this.__player.shoot();
        }

    };


    return Class;

});
