import React from 'react';

import classes from './MapSquare.module.css';

const mapSquare = (props) => {

    const squareClasses = [classes.MapSquare];
    switch( props.type ) {
        case 'floor':
            squareClasses.push(classes.Floor);
            if ( props.isLanding) squareClasses.push(classes.Landing);
            break;
        case 'wall':
            squareClasses.push(classes.Wall);
            break;
        default:
            squareClasses.push(classes.Blank);
    }

    return (
        <div 
            className={squareClasses.join(' ')} 
            onClick={(event) => props.clickHandler(event, props)}
        >

        </div>
    );
};

export default mapSquare;
