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
        },

        renderPlayer: function(entity) {
            var map = entity.getMap();
            var image = entity.getImage();

            // Player is always centered. Pos irrelevant.
            //var pos = entity.getPosition();

            var centerX = this.__width / 2;
            var centerY = this.__height / 2;

            this.drawSprite(
                0 - entity.width / 2 + centerX, //pos.x - entity.width / 2 - this.camX,
                0 - entity.height / 2 + centerY, //pos.y - entity.height / 2 - this.camY,
                image,
                map
            );

        },

        renderWallSprite: function(entity) {
            var map = entity.getMap();
            var image = entity.getImage();

            var centerX = this.__width / 2;
            var centerY = this.__height / 2;

            this.drawSprite(
                0 - entity.width / 2 + centerX,
                0 - entity.height / 2 + centerY,
                image,
                map
            );

        },

        renderParallaxBackground: function(bgEntity, playerEntity) {

            var playerPosition = playerEntity.getPosition();
            var image = bgEntity.getImage();
            var width = bgEntity.__image.width;
            var height = bgEntity.__image.height;

            var posX = 0 - this.camX * bgEntity.parallax;
            var posY = 0 - this.camY * bgEntity.parallax / 5;

            for(var i = -5; i < 6; i++) {
                for (var j = -2; j < 3; j++) {
                    console.log(width, height)
                    this.drawSprite(posX + i * width, posY + j * height, image);
                }
            }

        }


    };


    return Class;

});
