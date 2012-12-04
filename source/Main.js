/*global lychee game console document _*/

lychee.define('game.Main').requires([
    'lychee.Font',
    'lychee.Input',
    'game.Jukebox',
    'game.Renderer',
    'game.Tileset',
    'game.state.Game',
    'game.state.Menu',
    'game.DeviceSpecificHacks'
]).includes([
    'lychee.game.Main'
]).exports(function(lychee, global) {

    var Class = function(settings) {

        lychee.game.Main.call(this, settings);

        this.fonts = {};

        this.__offset = { x: 0, y: 0 };

        this.load();

    };


    Class.prototype = {

        defaults: {
            title: 'Fork Lift Driver Klaus',
            base: './asset',
            sound: true,
            music: true,
            fullscreen: false,
            renderFps: 60,
            updateFps: 60,
            width: 800 ,
            height: 600
        },

        load: function() {

            var base = this.settings.base;

            var urls = {
                headlineFont    : base + '/img/font_48_white.png',
                normalFont      : base + '/img/font_32_white.png',
                smallFont       : base + '/img/font_16_white.png',
                metatilesImage  : base + '/img/metatiles.png',
                forkImage       : base + '/img/fork.png',
                forkJson        : base + '/json/fork-sprites.json',
                playerImage     : base + '/img/player-sprites.png',
                playerJson      : base + '/json/player-sprites.json',
                levels: {}
            };
            _.each(['01', '02'], function(level) {
                urls.levels[level] = {
                    bg1:   base + '/img/l' + level + '/bg1.png',
                    bg2:   base + '/img/l' + level + '/bg2.png',
                    tiles: base + '/img/l' + level + '/tiles.png',
                    json:  base + '/json/l' + level + '.json'
                };
            });

            this.preloader = new lychee.Preloader({
                timeout: 3000
            });

            this.preloader.bind('ready', function(assets) {

                document.body.className = document.body.className.replace('loading', 'loaded');

                this.assets = assets;

                this.fonts.headline = new lychee.Font(assets[urls.headlineFont], {
                    kerning: 0,
                    spacing: 8,
                    map: [15,20,29,38,28,43,33,18,23,24,26,24,18,24,20,31,29,22,29,28,27,27,29,23,31,30,17,18,46,24,46,26,54,25,27,25,26,23,23,29,27,16,22,27,22,36,28,29,23,31,25,27,23,26,25,34,25,24,29,25,30,25,46,30,18,25,27,25,26,23,23,29,27,16,22,27,22,36,28,29,23,31,25,27,23,26,25,34,25,24,29,37,22,37,46]
                });

                this.fonts.normal = new lychee.Font(assets[urls.normalFont], {
                    kerning: 0,
                    spacing: 8,
                    map: [12,15,21,28,21,30,24,14,17,18,19,18,14,18,15,23,21,17,21,21,20,20,21,18,22,22,14,14,33,18,33,20,38,19,20,19,19,18,18,21,20,13,16,20,16,26,21,21,18,22,19,20,17,20,18,24,19,18,21,18,22,18,33,22,14,19,20,19,19,18,18,21,20,13,16,20,16,26,21,21,18,22,19,20,17,20,18,24,19,18,21,26,17,26,33]
                });

                this.fonts.small = new lychee.Font(assets[urls.smallFont], {
                    kerning: 0,
                    spacing: 8,
                    map: [9,11,14,17,13,18,15,10,12,12,13,12,10,12,11,14,14,11,14,13,13,13,14,12,14,14,10,10,19,12,19,13,22,12,13,12,13,12,12,14,13,9,11,13,11,16,13,14,12,14,12,13,12,13,12,15,12,12,14,12,14,12,19,14,10,12,13,12,13,12,12,14,13,9,11,13,11,16,13,14,12,14,12,13,12,13,12,15,12,12,14,16,11,16,19]
                });


                this.config = {
                    player: assets[urls.playerJson],
                    fork: assets[urls.forkJson],
                    levels: {}
                };

                this.config.player.image = assets[urls.playerImage];
                this.config.fork.image = assets[urls.forkImage];
                this.config.tilesets = {};

                _.each(urls.levels, function(val, name) {
                    var json = assets[urls.levels[name].json],
                        tilesets = {};

                    this.config.levels[name] = json;
                    _.each(json.tilesets, function(tileset) {
                        tileset.image = tileset.image.replace(/^\.\./, './asset');
                        // if (tileset.name === 'metatiles') {
                        //     tileset.isMeta = true;
                        //     delete tileset.image;
                        // }
                        this.config.tilesets[tileset.name] = new game.Tileset(tileset, assets);
                    }, this);

                }, this);

                this.init();

            }, this);

            this.preloader.bind('error', function(urls) {
                if (lychee.debug) {
                    console.warn('Preloader error for these urls: ', urls);
                }
            }, this);

            this.preloader.load(this.__getUrlsFromObject(urls));

        },

        __getUrlsFromObject: function(obj) {
            return _(obj).reduce(function(arr, val, key) {
                if (_.isString(val)) {
                    arr.push(val);
                } else {
                    arr = arr.concat(this.__getUrlsFromObject(val));
                }
                return arr;
            }, [], this);
        },

        reset: function() {

            game.DeviceSpecificHacks.call(this);

            var env = this.renderer.getEnvironment();

            if (this.settings.fullscreen) {
                this.settings.width = env.screen.width;
                this.settings.height = env.screen.height;
            } else {
                this.settings.width = this.defaults.width;
                this.settings.height = this.defaults.height;
            }

            this.renderer.reset(this.settings.width, this.settings.height, false);

            this.__offset = env.offset; // Linked

        },

        init: function() {

            lychee.game.Main.prototype.init.call(this);

            this.renderer = new game.Renderer('game');

            this.renderer.reset(
                this.settings.width,
                this.settings.height,
                true
            );

            this.renderer.setBackground("#ffffff");

            this.reset();

            this.jukebox = new game.Jukebox(this);

            this.input = new lychee.Input({
                delay: 0,
                fireModifiers: true
            });


            this.states = {
                game:    new game.state.Game(this),
                menu:    new game.state.Menu(this)
            };

            this.setState('menu');

            this.start();

        },

        getOffset: function() {
            return this.__offset;
        }

    };


    return Class;

});
