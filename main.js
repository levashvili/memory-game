require.config({
//    baseUrl:'../src/',
    urlArgs: 'cb=' + Math.random(),
    paths: {
        jquery: 'lib/jquery/jquery-1.10.2',
        underscore: 'lib/underscore/underscore',
        backbone: 'lib/backbone/backbone',
        text: 'lib/require/text'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    }
});

require([
    'jquery',
    'underscore',
    'js/views/heart',
    'js/board'
], function($, _, Heart, Board) {

    var board = new Board();
    var heart = new Heart({
        board: board
    });

    $('#container').html(heart.render().el).show();

});
