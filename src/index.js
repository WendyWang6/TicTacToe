import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import pieceX from './cat.png'; // Tell webpack this JS file uses this image
import pieceO from './dog.png'; 



/*
class Square extends React.Component {
*/

/*
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }
*/

/*
    render() {
        return (
            <button
                className="square"
                onClick={() => this.props.onClick()}
            >
                {this.props.value}
            </button>
        );
    }
}
*/

//<img className="player1" src={pieceX} alt="pieceX" />
//<img className="player2" src={pieceO} alt="pieceO" />


/*
class Piece extends React.Component {
    constructor(props) {
        super(props);
        
    }
    
    changeState(replace) {
        this.setState({ pieceImg: replace }); 
    }
    
    render() {
        let piece = null
        if (this.props.value) {
            piece = this.props.xIsNext ? <img className="player1" src={pieceX} alt="pieceX" /> : <img className="player2" src={pieceO} alt="pieceO" /> 
        }
        
        return (
            <div>
                {piece}
            </div>
        );
    }
}
*/


// replace the Square class by this function component
class Square extends React.Component {
   
    /*
    // This code was used to pass props into Piece component
    <Piece
        value={props.value}
        xIsNext={props.xIsNext}
    />
    */
    constructor(props) {
        super(props);

    }

    render() {
        let piece = null
        if (this.props.value) {
            piece = this.props.value === "X" ? <img className="player1" src={pieceX} alt="pieceX" /> : <img className="player2" src={pieceO} alt="pieceO" />
        }

        return (
            <button className="square" data-pro={this.props.value} data-win={this.props.win} onClick={this.props.onClick}>
                {piece}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        let win = false;
        ///*
        if (this.props.winningLine && this.props.winningLine.includes(i)) {
            win = true;
        }
        //*/
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                win={win}
                xIsNext={this.props.xIsNext}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true
        };
    }


    //********************************
    //<img className="player1" src={pieceX} alt="pieceX" />  

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const result = calculateWinner(squares);
        let winner = null;
        if (result) {
            winner = result.winner;
        }

        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O"
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const result = calculateWinner(current.squares);
        let winner = null;
        let winningLine = null;
        if (result) {
            winner = result.winner;
            winningLine = result.match;
        }

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "Player1"  : "Player2"); //**********************
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningLine={winningLine}
                        onClick={i => this.handleClick(i)}
                        xIsNext={this.state.xIsNext}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{winningLine}</div>
                    <ol>{moves}</ol>
                </div>

                <div>

                </div>

               


            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        // debug
        console.log("test", squares[a]);
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { 
            return { winner: squares[a], match: lines[i] };
        }
    }
    

    return null;
}

