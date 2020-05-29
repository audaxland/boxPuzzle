import React from 'react';

import classes from './Game.module.css';

import GameLevel from '../GameLevel/GameLevel';
import Results from '../WinMessage/Result';
import TopBar from '../TopBar/TopBar';

class Game extends React.Component {

    state = {
        currentLevel: 0,
        currentAttemp: 1,
        levelLog: [],
    }


    componentDidMount() {
        this.setState({
            currentLevel: this.props.startLevel
        });
    }

    /**
     * change the level from the goTo Level menu
     */
    goToLevel = (level) => {
        this.setState({
            currentLevel: level,
            currentAttemp: 1
        });
    }

    /**
     * save the stats form the level just finished and move to the next level
     */
    nextLevel = (winInfo) => {
        this.setState(prevState => {
            return {
                currentLevel: prevState.currentLevel + 1,
                levelLog: [...prevState.levelLog, { ...winInfo, attempts: prevState.currentAttemp }],
                currentAttemp: 1
            }
        });
    };

    /**
     * action from the Restart button 
     */
    resetCurrentLevel = () => {
        this.setState(prevState => ({ currentAttemp: prevState.currentAttemp + 1 }));
    }

    render() {
        if (this.props.levels[this.state.currentLevel]) {
            return (
                <div className={classes.Game}>
                    <TopBar
                        resetCurrentLevel={this.resetCurrentLevel}
                        levelsList={this.props.levels}
                        level={this.props.levels[this.state.currentLevel].level}
                        goToLevel={this.goToLevel}
                        switchGameMode={this.props.switchGameMode}

                    />
                    {/* the key on GameLevel allows to force unmount and remount when changing level or restarting level */}
                    <GameLevel
                        key={this.state.currentLevel + '_' + this.state.currentAttemp}
                        level={this.props.levels[this.state.currentLevel]}
                        levelHandler={this.nextLevel}
                    />
                </div>
            );
        }

        return (
            <div className={classes.Game}>
                <Results
                    levelLog={this.state.levelLog}
                    playAgain={() => this.goToLevel(0)}
                />
            </div>
        );
    };
};

export default Game;