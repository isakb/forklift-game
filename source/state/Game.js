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

        this._input = this.game.input;
        this._loop = this.game.loop;
        this._renderer = this.game.renderer;

        this._clock = 0;
        this._skyboxEntity = null;
        this._backgroundEntity = null;
        this._layers = [];
        this._guiEntities = {};
        this._player = null;
        this._playerStart = null;
        this._forks = [];
        this._enemies = [];
        this._exit = null;
        this._locked = false;

        this.reset();

    };


    Class.prototype = {

        reset: function() {

            this._level = '01';

        },

        enter: function() {

            lychee.game.State.prototype.enter.call(this);

            this._locked = true;

            this._enterLevel(this._level);

            if (this.game.settings.music) {
                this.game.jukebox.play('music', true, 0.7);
            }

            this._input.bind('left', this._onKeyLeft, this);
            this._input.bind('right', this._onKeyRight, this);
            this._input.bind('up', this._onKeyUp, this);
            this._input.bind('down', this._onKeyDown, this);

            this._input.bind('space', this._onKeySpace, this);

            this._renderer.start();

        },

        leave: function() {

            this._renderer.stop();
            this._input.unbind('left', this._onKeyLeft);
            this._input.unbind('right', this._onKeyRight);
            this._input.unbind('up', this._onKeyUp);
            this._input.unbind('down', this._onKeyDown);

            this._input.unbind('space', this._onKeySpace);

            this._tileCache = undefined;

            lychee.game.State.prototype.leave.call(this);

        },

        update: function(clock, delta) {


            this._player.update(clock, delta);

            for (var e in this._guiEntities) {
                if (this._guiEntities[e] === null) continue;
                this._guiEntities[e].update(clock, delta);
            }

            for (var f in this._forks) {
                if (this._forks[f] === null) continue;
                this._forks[f].update(clock, delta);
            }

            this._clock = clock;

        },

        render: function(clock, delta) {

            var entity, i, layer;

            this._renderer.clear();

            this._renderer.moveCameraTo(this._player);

            this._renderer.renderParallaxBackground(this._skyboxEntity, this._player);

            this._renderer.renderParallaxBackground(this._backgroundEntity, this._player);

            for (i in this._layers) {
                layer = this._layers[i];

                if (layer === 'entities') {
                    // Render all entities, player, forks etc. before continuing
                    // with foreground layer(s).
                    for (var fork in this._forks) {
                        this._renderer.renderEntity(this._forks[fork]);
                    }
                    this._renderer.renderEntity(this._player);

                    this._renderer.renderDebugBox(this._playerStart, '#0f0');
                    this._renderer.renderDebugBox(this._exit, '#00f');

                } else {
                    this._renderer.renderLayer(
                        layer,
                        this.game.config.tilesets,
                        this._tileWidth,
                        this._tileHeight
                    );
                }
            }

            // TODO: only do this for debug
            this._renderer.renderLayer(
                this._collisionLayer,
                this.game.config.tilesets,
                this._tileWidth,
                this._tileHeight
            );

            for (var e in this._guiEntities) {
                entity = this._guiEntities[e];

                if (entity === null) {
                    continue;
                } else if (entity.type) {
                    this._renderer['render' + entity.type](entity);
                } else {
                    this._renderer.renderUIEntity(this._guiEntities[e]);
                }
            }

            this._renderer.flush();

        },


        _enterLevel: function(level) {

            var levelConfig = this.game.config.levels[level];

            console.log('Making level %s (%s)', level, levelConfig.properties.title);

            var assets = this.game.assets;


            var LEVEL_IMG_PREFIX = './asset/img/l';

            var width = this.game.settings.width;
            var height = this.game.settings.height;

            var tileImage = assets[LEVEL_IMG_PREFIX + level + '/tiles.png'];

            this._skyboxEntity = new lychee.game.Sprite({
                image: assets[LEVEL_IMG_PREFIX + level + '/bg1.png']
            });
            this._skyboxEntity.parallax = 0.05;

            this._backgroundEntity = new lychee.game.Sprite({
                image: assets[LEVEL_IMG_PREFIX + level + '/bg2.png']
            });
            this._backgroundEntity.parallax = 0.2;

            this._exit = new game.entity.Exit();

            this._player = new game.entity.Player(this.game, this);

            this._tileWidth = levelConfig.tilewidth;
            this._tileHeight = levelConfig.tileheight;
            var tileSets = levelConfig.tilesets;
            var layers = levelConfig.layers;

            this._tileCache = {};

            _.each(layers, function(layer) {
                this._makeLayer(layer);
            }, this);

            this._locked = false;

            this._guiEntities.title = new lychee.ui.Text({
                text: levelConfig.properties.title,
                font: this.game.fonts.normal,
                position: {
                    x: width / 2,
                    y: -200
                }
            });

            this._guiEntities.description = new lychee.ui.Text({
                text: levelConfig.properties.description,
                font: this.game.fonts.small,
                position: {
                    x: width / 2,
                    y: height + 24
                }
            });

            this._guiEntities.title.setTween(1500, {
                y: height / 2 - 100
            }, lychee.game.Entity.TWEEN.easeOut);

            this._loop.timeout(1000, function() {
                this._guiEntities.description.setTween(500, {
                    y: height / 2 + 100
                }, lychee.game.Entity.TWEEN.easeOut);

            }, this);

            this._loop.timeout(3000, function() {
                this._guiEntities.title.setTween(500, {
                    x: -1000
                }, lychee.game.Entity.TWEEN.easeIn);

                this._guiEntities.description.setTween(500, {
                    x: -1000
                }, lychee.game.Entity.TWEEN.easeIn);

            }, this);

        },

        _makeLayer: function(layer) {

            switch(layer.type) {
                case 'tilelayer':
                    if (layer.name === 'collision') {
                        this._collisionLayer = layer;
                    } else {
                        this._layers.push(layer);
                    }
                    break;

                case 'objectgroup':
                    if (layer.name === 'enemy_entities') {
                        this._addEnemies(layer.objects);
                    } else if (layer.name === 'entities') {
                        this._addEntities(layer.objects);

                        // Placeholder for rendering order:
                        this._layers.push('entities');
                    }
                    break;

                default:
                    console.info('Ignoring layer: ' + layer.name);
            }


        },

        _addEntities: function(entities) {
            _.each(entities, function(entity) {
                if (entity.type === 'Player') {
                    this._player.setPosition({x: entity.x, y: entity.y});
                    this._player.width = entity.width;
                    this._player.height = entity.height;

                    this._playerStart = new lychee.game.Sprite({
                        position: {
                            x: entity.x,
                            y: entity.y
                        },
                        width: entity.width,
                        height: entity.height
                    });

                } else if (entity.type === 'Exit') {
                    // Let's limit it to one exit per level for now.
                    this._exit.setPosition({x: entity.x, y: entity.y});
                    this._exit.width = entity.width;
                    this._exit.height = entity.height;
                    this._exit.nextLevel = entity.properties.next;
                } else {
                    console.warn('Ignored map entity: ' + entity.type);
                }

            }, this);
        },

        _addEnemies: function(entities) {
            _.each(entities, function(entity) {
                var Klass = game.entity[entity.type];
                this._enemies[entity.name] = new Klass(entity.properties);

            }, this);
        },

        spawnFork: function(position, speed, direction) {
            this._forks.push(new game.entity.Fork({
                direction: direction,
                position: position,
                speed: {
                    x: speed.x + 0.5 * (direction === 'right' ? 1 : -1),
                    y: speed.y -0.3
                }
            }, this.game));
        },


        _onKeyLeft: function(position, event) {
            event.preventDefault();
            this._player.goLeft();
        },

        _onKeyRight: function(position, event) {
            event.preventDefault();
            this._player.goRight();
        },

        _onKeyUp: function(position, event) {
            event.preventDefault();
            this._player.goUp();
        },

        _onKeyDown: function(position, event) {
            event.preventDefault();
            this._player.goDown();
        },

        _onKeySpace: function(position, event) {
            event.preventDefault();
            this._player.shoot();
        }

    };


    return Class;

});
