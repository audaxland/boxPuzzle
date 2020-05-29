import React from 'react';
import classes from './Result.module.css';

const results = (props) => {
    return (
        <div className={classes.Results}>
            <header>
                <h1>Congratualtions!!</h1>
                <h1>You have won all levels</h1>
            </header>
            <div>
                <h3>Your Stats</h3>
                <ul>
                    {props.levelLog.map(level => (
                        <li key={level.level}>
                            <div>Level: {level.level}</div>
                            <div>Time: {level.time}</div>
                            <div>Moves: {level.moves}</div>
                        </li>
                    ))}
                </ul>
            </div>

            <footer>
                <button onClick={props.playAgain}>Play Again</button>
            </footer>

        </div>
    );
};

export default results;