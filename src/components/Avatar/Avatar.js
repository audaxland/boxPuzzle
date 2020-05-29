import React from 'react';

import classes from './Avatar.module.css';

import sprite from './sprite.png';

class Avatar extends React.Component {
    
    render() {
        if (!this.props.player) return null;
        let directionClass = classes.Down;
        if (this.props.player.direction === 'up') directionClass = classes.Up;
        if (this.props.player.direction === 'right') directionClass = classes.Right;
        if (this.props.player.direction === 'left') directionClass = classes.Left;
        return (
            <div 
                className={classes.AvatarSquare}
                style={{
                    width: this.props.squareSize + 'px',
                    height: this.props.squareSize + 'px',
                    left: (this.props.squareSize * this.props.player.x) + 'px',
                    top: (this.props.squareSize * this.props.player.y) + 'px'
                }}
                onClick={(event) => this.props.clickHandler ? this.props.clickHandler(event, this.props.player) : null}
            >
                <div className={classes.Avatar}>
                    <div
                         className={classes.Sprite + ' ' + directionClass}
                         style={{backgroundImage: "url('" + sprite + "')"}}
                    >
                    </div>
                </div>
            </div>
        );
    };
}

export default Avatar;