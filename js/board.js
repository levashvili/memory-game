/** @jsx React.DOM */
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var Board = function(obj) {
        this.initialize(obj);
    };

    _(Board.prototype).extend(Backbone.Events, {

        initialize: function(obj) {

            this.SQUARE_STATE_HIDDEN = 'hidden';
            this.SQUARE_STATE_EXPOSED = 'exposed';
            this.SQUARE_STATE_BINGO = 'bingo';

            this.SQUARE_ACTION_NONE = 'none';
            this.SQUARE_ACTION_FLASH = 'flash';

            this.GAME_STATE_WON = 'won';
            this.GAME_STATE_LOST = 'lost';
            this.GAME_STATE_IN_PROGRESS = 'in progress';
            this.GAME_STATE_MEMORIZE = 'memorize';

            this.onStateChange = function(){};
            this.points = obj && obj.points ? obj.points : 20;
//            this.countdownSecs = obj && obj.seconds ? obj.seconds : 3;
            this.countdownSecs = 5;
            this.board = this.createBoard();
            this.exposedSquare = null;

            this.setGameState(this.GAME_STATE_MEMORIZE);

            this.interval = setInterval(this.countdown.bind(this), 1000);



        },

        setGameState: function(state) {
            this.gameState = state;
            this.onStateChange();
        },

        setCountdownSecs: function(secs) {
            this.countdownSecs = secs;
            this.onStateChange();
        },

        setPoints: function(points) {
            this.points = points;
            this.onStateChange();
        },

        countdown: function() {
            console.log('countdown: ' + this.countdownSecs);
            this.setCountdownSecs(this.countdownSecs - 1);
            if(this.countdownSecs < 0) {
                clearInterval(this.interval);
                this.setGameState(this.GAME_STATE_IN_PROGRESS);
                this.hideAllSquares();
            }
            this.trigger('board:countdown');
        },

        getHeartMap: function() {
            var heartMap =
                [
                    0,0,1,0,0,0,0,0,1,0,0,
                    0,1,1,1,0,0,0,1,1,1,0,
                    1,1,1,1,1,0,1,1,1,1,1,
                    1,1,1,1,1,1,1,1,1,1,1,
                    0,1,1,1,1,1,1,1,1,1,0,
                    0,0,1,1,1,1,1,1,1,0,0,
                    0,0,0,1,1,1,1,1,0,0,0,
                    0,0,0,0,1,1,1,0,0,0,0,
                    0,0,0,0,0,1,0,0,0,0,0

                ];
            return heartMap;
        },

        getRandomIcons: function() {
            return _((_.range(1,28)).concat(_.range(1,28))).shuffle();
        },

        createBoard: function() {
            var board = [];
            var counter = 0;
            var randomIcons = this.getRandomIcons();
            _.each(this.getHeartMap(), function(isNotEmpty) {
                if(isNotEmpty) {
                    board.push({
                        isNotEmpty: true,
                        position: counter,
                        icon: randomIcons[counter++],
                        state: this.SQUARE_STATE_EXPOSED,
                        action: this.SQUARE_ACTION_NONE
                    });
                } else {
                    board.push({
                        isNotEmpty: false
                    });
                }
            }.bind(this));
            return board;
        },

        getBoard: function() {
            return this.board;
        },

        getCountdownSecs: function() {
            return this.countdownSecs;
        },

        getPoints: function() {
            return this.points;
        },

        expose: function(i) {
            _(this.board).findWhere({position: i}).state = this.SQUARE_STATE_EXPOSED;
            this.onStateChange();
        },

        bingo: function(i) {
            _(this.board).findWhere({position: i}).state = this.SQUARE_STATE_BINGO;
            this.onStateChange();
        },

        hideAllSquares: function() {
            var HIDDEN = this.SQUARE_STATE_HIDDEN;
            _.invoke(this.board, function() {
                if(this.isNotEmpty) {
                    this.state = HIDDEN;
                }
            });
            this.onStateChange();
            this.trigger('board:hide');
        },

        getRemaining: function() {
            var remaining = _(this.board).find(function(square) {
                return ((square.state == this.SQUARE_STATE_HIDDEN) || (square.state == this.SQUARE_STATE_EXPOSED));
            })
            return remaining;
        },

        play: function(i) {
            i = parseInt(i);
            var square = _.findWhere(this.board, {position: i});
            if(square.state != this.SQUARE_STATE_HIDDEN) {
                return false;
            }
            if(!this.exposedSquare) {
                this.expose(i);
                this.exposedSquare = square;
                this.trigger('square:expose', square.position);
                return true;
            }

            if(this.exposedSquare.icon == square.icon) {
                this.exposedSquare.state = this.SQUARE_STATE_BINGO;
                square.state = this.SQUARE_STATE_BINGO;
                this.exposedSquare = null;
                if(!this.getRemaining()) {
                    this.setGameState(this.GAME_STATE_WON);
                }
                this.trigger('square:expose', square.position);
                return true;
            }

            if(this.exposedSquare.icon != square.icon) {
                this.setPoints(this.points - 1);
                if(this.points <= 0) {
                    this.setGameState(this.GAME_STATE_LOST);
                }
                square.state = this.SQUARE_STATE_HIDDEN;
                square.action = this.SQUARE_ACTION_FLASH;
                this.trigger('square:flash', square.position);
                return true;
            }
            this.onStateChange();
        }
    });

    return Board;
});
