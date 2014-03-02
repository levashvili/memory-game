define([
    'jquery',
    'underscore',
    'backbone',
    'text!js/templates/heart.html'
], function($, _, Backbone, HeartTemplate){

    var View = Backbone.View.extend({

        template: _.template(HeartTemplate),

        board: null,

        events: {
            'click .heart-square': function(event) {
                //alert('square ' + event.currentTarget.id);
                this.board.play(event.currentTarget.id);
            }
        },

        initialize: function (obj) {
            _(this).extend(obj);
            this.board.on('board:countdown', this.countdown.bind(this));
            this.board.on('board:hide', this.hideBoard.bind(this));
            this.board.on('square:expose', this.exposeSquare.bind(this));
            this.board.on('square:flash', this.flashSquare.bind(this));
        },

        hideBoard: function() {
            $(".heart-square-card").removeClass("exposed");
        },

        exposeSquare: function(position) {
            $('#' + position).children(0).addClass('exposed');
        },

        flashSquare: function(position) {
            var square = $('#' + position).children(0);
            square.addClass('flash');
            square.on('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', function() {
                square.removeClass('flash');
            });
        },

        countdown: function() {
            $("#timer").html(this.board.getCountdownSecs());
        },

        render: function () {
            this.$el.hide();
            this.$el.html(this.template({
                countdown: this.board.getCountdownSecs(),
                points: this.board.getPoints(),
                squares: _(this.board.getBoard()).map( function(square) {

                    return {
                      isNotEmpty: square.isNotEmpty,
                      icon: square.icon,
                      position: square.position
                    };
                }.bind(this))
                //squares: this.board.getBoard()
            }));
            this.$el.show();
            return this;
        }
    });

    return View;
});
