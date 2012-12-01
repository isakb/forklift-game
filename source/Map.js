/*global lychee game */

lychee.define('game.Map').requires([
    'lychee.game.Graph'
]).exports(function(lychee, global) {

    var Class = function(config) {

        lychee.game.Graph.call(this, game.renderer);

        this.__bg1 = new lychee.ui.Graph({
            image: config.bg1
        });

        this.__bg2 = new lychee.ui.Graph({
            image: config.b2
        });

    };

    Class.prototype = {

        /*
         * PUBLIC API
         */



    };


    return Class;

});

