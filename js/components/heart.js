/** @jsx React.DOM */
define([
    'jquery',
    'underscore',
    'react',
    'board'
], function($, _, React, Board) {


    var Square = React.createClass({
        handleClick: function() {
            console.log('clicking');
            if (this.props.board.play(this.props.position))
                this.props.onPlay();
        },

        getClass: function(state, action) {
            var className = "heart-square-card";
            if(action == 'flash') {
                className = "heart-square-card flash";

                return className;
            } else {
                if(state == 'hidden') {
                    className = "heart-square-card";
                } else if(state == 'exposed') {
                    className = "heart-square-card exposed";
                } else if(state == 'bingo') {
                    className = "heart-square-card exposed";
                }
            }

            return className;
        },

        render: function() {

            if(!this.props.isNotEmpty) {
                return (
                    <div
                    className="empty-square"
                    ></div>
                    );
            } else {
                return (<div
                    className="heart-square"
                    onClick={this.handleClick}
                    >
                    <div
                    ref="animatedCard"
                    className={this.getClass(this.props.state, this.props.action)}
                    >
                        <div className="front face"
                        onClick=""
                        ></div>
                        <div className="back face center">
                            <img src={"images/icons_numbered/" + this.props.icon + ".png"} />
                        </div>
                    </div>
                </div>);
            }
        }
    });

    var Heart = React.createClass({
        render: function() {
            var squares = [];
            var board = this.props.board;
            var boardSquares = this.props.board.getBoard();
            var onPlay = this.props.onPlay;
            _.each(boardSquares, function(square, index) {
                squares.push(Square({
                    board: board,
                    isNotEmpty: square.isNotEmpty,
                    position: square.position,
                    icon: square.icon,
                    state:square.state,
                    action:square.action,
                    onPlay: onPlay
                }));
            });

            return <div id="board" className="heart">{squares}</div>;
        }
    });

    var Countdown = React.createClass({
        render: function() {
            return (
                <div
                className="timer"
                >
                    <h1>Countdown</h1>
                    <span>{this.props.seconds}</span>
                </div>
            );
        }
    });

    var PointsTally = React.createClass({
        render: function() {
            return (
                <div
                className="points"
                >
                    <h1>Points</h1>
                    <span>{this.props.points}</span>
                </div>
                );
        }
    });

    var ContainerView = React.createClass({
        getInitialState: function() {
            this.props.board.onStateChange = this.onBoardUpdate.bind(this);
            return {'board': this.props.board};
        },

        onBoardUpdate: function() {
            this.setState({"board": this.props.board});
        },
        render: function() {
            return (
                <div>
                    <Countdown seconds={this.props.board.getCountdownSecs()} />
                    <PointsTally points={this.props.board.getPoints()} />
                    <Heart
                        board={this.state.board}
                        onPlay={this.onBoardUpdate.bind(this)}
                    />
                </div>
                )
        }
    });

    var board = new Board({});
    React.renderComponent(
        <ContainerView board={board} />,
        $('#container').get(0)
    );

    return ContainerView;
});
