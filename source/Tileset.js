/*global lychee */

// TMX Map format.
// json ref: https://github.com/bjorn/tiled/wiki/TMX-Map-Format

lychee.define('game.Tileset').requires([
    'lychee.game.Entity'
]).includes([
    'lychee.ui.Sprite'
]).exports(function(lychee, global) {

    // assets must contain a preloaed tileset image (json.image)
    var Class = function(json, assets) {

        // The URL of the tilset image.
        if (!(json.image in assets)) {
            throw new Error('Tileset image is not in assets: ' + json.image);
        }

        // The margin around the tiles in this tileset (applies to the tileset
        // image).
        if (json.margin > 0) {
            throw new Error('Tile image with margin is not supported');
        }

        // The spacing in pixels between the tiles in this tileset (applies to
        // the tileset image).
        if (json.spacing > 0) {
            throw new Error('Tile image with spacing is not supported');
        }

        this.__name = json.name;

        // The first global tile ID of this tileset (this global ID maps to the
        // first tile in this tileset).
        this.__firstGID = json.firstgid;

        // The (maximum) width of the tiles in this tileset.
        this.__tileWidth = json.tilewidth;

        // The (maximum) height of the tiles in this tileset.
        this.__tileHeight = json.tileheight;

        this.__image = this.__validatedImage(assets[json.image], json);

        this.__createStatesAndMap();

        lychee.game.Sprite.call(this, {
            image: this.__image,
            states: this.__states,
            map: this.__map
        });

    };


    Class.prototype = {

        hasGID: function(gid) {
            return this.__firstGID <= gid && gid <= this.__lastGID;
        },


        __validatedImage: function(image, json) {
            if (json.imagewidth !== image.naturalWidth ||
                json.imageheight !== image.naturalHeight) {

                throw new Error('Unexpected image width or height');
            }

            return image;
        },


        __createStatesAndMap: function() {
            var i, j, count,
                W = this.__tileWidth,
                H = this.__tileHeight,
                map = {},
                states = {},
                img = this.__image;

            count = 0;

            for (i = 0; i < img.naturalHeight; i += H) {
                for (j = 0; j < img.naturalHeight; j += W) {
                    count += 1;

                    states[this.__firstGID + count] = count;
                    map[this.__firstGID + count] = {
                        width: W,
                        height: H
                    };
                }
            }

            this.__numTiles = count;
            this.__lastGID = this.__firstGID + count;
            this.__states = states;
            this.__map = map;

        }

    // "states": {
    //     "right":  0,
    //     "left": 1
    // },

    // "map": {

    //     "left": {
    //         "width":  32,
    //         "height": 32,
    //         "frames": [
    //             { "x": 64,    "y": 0, "w": 32, "h": 32 },
    //             { "x": 96,    "y": 0, "w": 32, "h": 32 }
    //         ]
    //     },

    //     "right": {
    //         "width":  32,
    //         "height": 32,
    //         "frames": [
    //             { "x": 0,    "y": 0, "w": 32, "h": 32 },
    //             { "x": 32,    "y": 0, "w": 32, "h": 32 }
    //         ]
    //     }
    // }



    };


    return Class;

});
