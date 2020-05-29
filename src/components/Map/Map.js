import React from 'react';

import classes from './Map.module.css';

import MapSquare from './MapSquare';

class Map extends React.Component {


    /**
     * the map doesn't change until the level is over, so don't update
     */
    shouldComponentUpdate() {
        return !this.props.isStatic;
    }

    clickHandler = (event, props) => {
        if (this.props.clickHandler) {
            this.props.clickHandler(event, props);
        }
    }

    render() {
        let mapKey = 0;
        return (
            <div
                className={classes.WorldMap}
            >
                {this.props.worldMap.map(row => {
                    return (
                        <div key={'mapKey_' + mapKey++}>
                            {row.map(square => {

                                return (
                                    <div className={classes.Square} key={'mapKey_' + mapKey++}>
                                        <MapSquare {...square} clickHandler={this.clickHandler} />
                                    </div>
                                );
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Map;