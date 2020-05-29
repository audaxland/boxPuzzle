import React from 'react';

import classes from './WinMessage.module.css';

class WinMessage extends React.Component {
    constructor(props) {
        super(props);
        this.buttonRef = React.createRef();
    }

    componentDidMount() {
        this.buttonRef.current.focus();
    }

    render() {
        return (
            <div className={classes.WinOverlay}>
                <div className={classes.WinDialog}>
                    <h1>Congratualtions!!</h1>
                    <h1>You're a winner!</h1>
                    <button 
                        ref={this.buttonRef}
                        onClick={() => this.props.nextLevel({
                            moves: this.props.moves, 
                            time: this.props.time,
                            level: this.props.level
                        })}
                    >{this.props.lastLevel ? 'Continue...' : 'Next Level...'}</button>
                </div>
            </div>
        );
    }
}

export default WinMessage;