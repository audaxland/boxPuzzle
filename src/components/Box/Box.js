import React from 'react';

import classes from './Box.module.css';

import boxImage from './box.png';

const box = (props) => {
    const boxClasses = [classes.Box];
    if ( props.worldMap[props.x][props.y].isLanding ){
        boxClasses.push(classes.Landed);
    }
    return (
        <div 
            className={boxClasses.join(' ')}
            style={{
                width: props.squareSize + 'px',
                height: props.squareSize + 'px',
                left: (props.squareSize * props.x) + 'px',
                top: (props.squareSize * props.y) + 'px'
            }}
            onClick={(event) => props.clickHandler ? props.clickHandler(event, props) : null}
        >
            <img src={boxImage} className={classes.InnerBox} alt='box' />
        </div>
    );
} 

export default box;