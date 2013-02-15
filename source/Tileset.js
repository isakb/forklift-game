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

        this._name = json.name;

        // The first global tile ID of this tileset (this global ID maps to the
        // first tile in this tileset).
        this._firstGID = json.firstgid;

        // The (maximum) width of the tiles in this tileset.
        this._tileWidth = json.tilewidth;

        // The (maximum) height of the tiles in this tileset.
        this._tileHeight = json.tileheight;

        this._image = this._validatedImage(assets[json.image], json);

        this._createStatesAndMap();

        lychee.game.Sprite.call(this, {
            image: this._image,
            states: this._states,
            map: this._map
        });

    };


    Class.prototype = {

        hasGID: function(gid) {
            return this._firstGID <= gid && gid <= this._lastGID;
        },


        _validatedImage: function(image, json) {
            if (json.imagewidth !== image.naturalWidth ||
                json.imageheight !== image.naturalHeight) {

                throw new Error('Unexpected image width or height');
            }

            return image;
        },


        _createStatesAndMap: function() {
            var i, j, count,
                W = this._tileWidth,
                H = this._tileHeight,
                map = {},
                states = {},
                img = this._image;

            count = 0;

            for (i = 0; i < img.naturalHeight; i += H) {
                for (j = 0; j < img.naturalHeight; j += W) {
                    count += 1;

                    states[this._firstGID + count] = count;
                    map[this._firstGID + count] = {
                        width: W,
                        height: H
                    };
                }
            }

            this._numTiles = count;
            this._lastGID = this._firstGID + count;
            this._states = states;
            this._map = map;

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
