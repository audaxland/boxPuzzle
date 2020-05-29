import React from 'react';

import Map from '../Map/Map';
import Avatar from '../Avatar/Avatar';
import Box from '../Box/Box';
import classes from './LevelMaker.module.css';

const neighbours = [[-1, -1, 315], [-1, 0, 270], [-1, 1, 225], [0, -1, 180], [0, 1, 0], [1, -1, 45], [1, 0, 90], [1, 1, 135]];

class LevelMaker extends React.Component {

    state = {
        worldMap: [],
        squareSize: 50,
        player: null,
        boxes: [],
        level: {
            dimension: 15,
            floor: [[7, 7]],
            startBoxes: [],
            endBoxes: [],
            player: [7, 7]
        }
    };

    componentDidMount() {
        this.setMapToState({ ...this.state.level });
    }

    resetLevelMaker = () => {
        this.setMapToState({
            dimension: 15,
            floor: [[7, 7]],
            startBoxes: [],
            endBoxes: [],
            player: [7, 7]
        });
    }

    setMapToState = (level) => {
        let boxId = 0;
        this.setState(
            {
                worldMap: this.makeWorldMap(level),
                player: level.player ? {
                    x: level.player[0],
                    y: level.player[1],
                    direction: 'down'
                } : null,
                boxes: level.startBoxes.map(box => {
                    return {
                        id: boxId++,
                        x: box[0],
                        y: box[1],
                        landed: false
                    }
                }),
                level: level
            }
        );
    }


    makeWorldMap(level) {
        const worldMap = [];
        var x, y, deltaX, deltaY, direction;
        for (x = 0; x < level.dimension; x++) {
            worldMap[x] = [];
            for (y = 0; y < level.dimension; y++) {
                worldMap[x][y] = {
                    type: null,
                    x: x,
                    y: y,
                    isLanding: false
                }
            }
        }
        for ([x, y] of level.floor) {
            worldMap[x][y].type = 'floor';
            for ([deltaX, deltaY, direction] of neighbours) {
                if ((x + deltaX >= 0)
                    && (x + deltaX < level.dimension)
                    && (y + deltaY >= 0)
                    && (y + deltaY < level.dimension)
                    && (worldMap[x + deltaX][y + deltaY].type === null)
                ) {
                    if (worldMap[x + deltaX][y + deltaY].type === null) {
                        worldMap[x + deltaX][y + deltaY].type = 'wall';
                        worldMap[x + deltaX][y + deltaY].floorSides = [direction];
                    } else if (worldMap[x + deltaX][y + deltaY].type === 'wall') {
                        worldMap[x + deltaX][y + deltaY].floorSides.push(direction);
                    }
                }
            }
        }
        for ([x, y] of level.endBoxes) {
            worldMap[x][y].isLanding = true;
        }
        return worldMap;
    }

    isInArray(theArray, x, y) {
        return !!theArray.filter(([ix, iy]) => ((ix === x) && (iy === y))).length;
    }

    clickHandler = (event, props) => {
        const level = { ...this.state.level };

        if (level.player && this.isInArray([level.player], props.x, props.y)) {
            level.player = null;
        } else if (this.isInArray(level.floor, props.x, props.y)) {
            if (this.isInArray(level.startBoxes, props.x, props.y)) {
                level.startBoxes = level.startBoxes.filter(([ix, iy]) => !((ix === props.x) && (iy === props.y)));
                level.endBoxes.push([props.x, props.y]);
            } else if (!level.player) {
                level.player = [props.x, props.y];
            } else if (this.isInArray(level.endBoxes, props.x, props.y)) {
                level.endBoxes = level.endBoxes.filter(([ix, iy]) => !((ix === props.x) && (iy === props.y)));
                level.floor = level.floor.filter(([ix, iy]) => !((ix === props.x) && (iy === props.y)));
            } else {
                level.startBoxes.push([props.x, props.y]);
            }
        } else {
            level.floor.push([props.x, props.y]);
        }
        this.setMapToState(level);
    }

    addCustomLevel = () => {
        this.props.addCustomLevel(this.state.level);
        this.props.switchGameMode('game');
    }

    render() {
        if (!(this.state.worldMap)) {
            return (
                <div className={classes.LevelMaker}>
                    <div>Loading...</div>
                </div>
            );
        }

        const mapSize = (this.state.squareSize * this.state.level.dimension) + 'px';

        return (
            <div className={classes.LevelMaker}>
                <div
                    className={classes.MapContainer}
                    style={{ width: mapSize, height: mapSize }}
                >
                    <Map
                        worldMap={this.state.worldMap}
                        clickHandler={this.clickHandler}
                        isStatic={false}
                    />
                    {this.state.boxes.map(box => (
                        <Box
                            key={'box_' + box.id}
                            squareSize={this.state.squareSize}
                            worldMap={this.state.worldMap}
                            clickHandler={this.clickHandler}
                            {...box}
                        />
                    ))}
                    <Avatar
                        squareSize={this.state.squareSize}
                        player={this.state.player}
                        clickHandler={this.clickHandler}
                    />

                </div>
                <div>
                    <pre className={classes.CodeBlock}><code>
                        const level = {
                            JSON.stringify(this.state.level)
                                .replace(/,"/g, ', \n\t"')
                                .replace(/{/, '{\n\t')
                                .replace(/}/, '\n};')
                        }

                        {'\n\n'}export default level;
                    </code></pre>
                </div>
                <div className={classes.Buttons}>
                    <button onClick={this.resetLevelMaker} >Clear Level</button>
                </div>
                <div className={classes.Buttons}>
                    <button onClick={this.addCustomLevel} >Add Level</button>
                </div>
            </div>
        );
    };
};

export default LevelMaker;