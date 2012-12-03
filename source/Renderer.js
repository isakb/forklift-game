/*global lychee */

lychee.define('game.Renderer').includes([
    'lychee.ui.Renderer'
]).exports(function(lychee, global) {

    var Class = function(id) {

        lychee.ui.Renderer.call(this, id);

    };

    Class.prototype = {

        moveCameraTo: function(entity) {

            var offset = entity.getPosition();

            this.camX = offset.x;
            this.camY = offset.y;

            this.centerX = this.__width / 2;
            this.centerY = this.__height / 2;
        },


        renderPlayer: function(entity) {

            var map = entity.getMap(),
                image = entity.getImage();

            // Player is always centered.

            this.drawSprite(
                this.centerX - entity.width / 2,
                this.centerY - entity.height / 2,
                image,
                map
            );

        },


        renderLayer: function(layer, tileset, mapTileWidth, mapTileHeight) {

            var i, j, count, tile, posX, posY, tileWidth, tileHeight,
                data = layer.data,
                W = layer.width;
                H = layer.height;

            if (layer.name === 'collision') {
                // Rendering the collision layer.
                color = '#f00';
                fill = false;
                // TODO: Get from tileset
                tileWidth = 32;
                tileHeight = 32;
            } else {
                color = '#888';
                fill = true;
                // TODO: Get from tileset
                tileWidth = 16;
                tileHeight = 16;
            }

            var scaling = 1.5;
            mapTileWidth *= scaling;
            mapTileHeight *= scaling;
            tileWidth *= scaling;
            tileHeight *= scaling;

            count = 0;
            for (i = 0; i < H; i++) {
                for (j = 0; j < W; j++) {
                    tile = data[count++];

                    if (tile) {
                        posX = j * mapTileWidth - mapTileWidth / 2;
                        posY = i * mapTileHeight - mapTileHeight / 2;

                        // TODO: Use actual tile graphics
                        // NB: (z|0) is used to "convert z to integer", in order
                        // to avoid float artifacts such as gaps between tiles.
                        this.drawBox(
                            (this.centerX - this.camX + posX - tileWidth / 2) | 0,
                            (this.centerY - this.camY + posY - tileHeight / 2) | 0,
                            (this.centerX - this.camX + posX + tileWidth / 2) | 0,
                            (this.centerY - this.camY + posY + tileHeight / 2 ) | 0,
                            color,
                            fill
                        )
                        // this.drawSprite(
                        //     x,
                        //     y,
                        //     tileImage,
                        //     tileMap
                        // );
                    }
                }
            }
        },


        renderEntity: function(entity) {

            var map = entity.getMap();
            var image = entity.getImage();

            var pos = entity.getPosition();
            var posX = pos.x;
            var posY = pos.y;

            var centerX = this.__width / 2;
            var centerY = this.__height / 2;

            this.drawSprite(
                centerX + posX - entity.width / 2,
                centerY + posY - entity.height / 2,
                image,
                map
            );
        },


        renderParallaxBackground: function(bgEntity, playerEntity) {

            var playerPosition = playerEntity.getPosition();
            var image = bgEntity.getImage();
            var width = bgEntity.__image.naturalWidth;
            var height = bgEntity.__image.naturalHeight;

            var posX = 0 - this.camX * bgEntity.parallax;
            var posY = 0 - this.camY * bgEntity.parallax / 5;

            for(var i = -5; i < 6; i++) {
                for (var j = -2; j < 3; j++) {
                    this.drawSprite(posX + i * width, posY + j * height, image);
                }
            }

        }


    };


    return Class;

});
