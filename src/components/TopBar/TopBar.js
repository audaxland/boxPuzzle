import React from 'react';

import classes from './TopBar.module.css';

class TopBar extends React.Component {

    state = {
        showGoToList: false
    }

    toggleGoToList = () => {
        this.setState(prevState => ({ showGoToList: !prevState.showGoToList }));
    }

    handleGoTo = (index) => {
        this.setState({ showGoToList: false });
        this.props.goToLevel(index);
    };

    render() {
        const goToLevelStyle = {
            display: this.state.showGoToList ? 'flex' : 'none'
        };

        return (
            <div className={classes.TopBar}>
                <div>
                    <button
                        onClick={this.props.resetCurrentLevel}
                    >Restart</button>
                </div>
                <div>
                    <h1>
                        Level {this.props.level}
                    </h1>
                </div>
                <div>
                    <div>
                        <button onClick={this.toggleGoToList}>Go To Level</button>
                    </div>
                    <div
                        className={classes.GoToList}
                        style={goToLevelStyle}
                    >
                        <ul

                        >
                            {this.props.levelsList.map(({ level, index }) => {
                                return (
                                    <li
                                        key={level}
                                        onClick={() => this.handleGoTo(index)}
                                    >
                                        Level {level}
                                    </li>
                                )
                            })}
                        </ul>
                        <ul>
                            <li
                                onClick={() => this.props.switchGameMode('levelMaker')}
                            >
                                Level Maker
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        )
    }
}

export default TopBar;