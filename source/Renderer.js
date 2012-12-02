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

        renderLayer: function(layer) {

            debugger

            var i, j, tile, posX, posY,
                data = layer.data,
                W = layer.width;
                H = layer.height,
                tileWidth = 16,
                tileHeight = 16,
                timeImage = null
                tileMap = null;

            for (i = 0; i < H; i++) {
                for (j = 0; j < W; j++) {
                    tile = data[i * H + j];

                    if (tile) {
                        this.drawSprite()
                        // // Render the sprite
                        // this.drawSprite(
                        //     centerX + posX - tileWidth / 2,
                        //     centerY + posY - tileHeight / 2,
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
