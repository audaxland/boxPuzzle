import React from 'react';

import classes from './GameLevel.module.css';

import Map from '../Map/Map';
import Avatar from '../Avatar/Avatar';
import Box from '../Box/Box';
import WinMessage from '../WinMessage/WinMessage';

// list of blocks that are adjacent to the current block
const neighbours = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

class GameLevel extends React.Component {

    state = {
        worldMap: null,
        squareSize: 50,
        player: null,
        boxes: [],
        isWin: false,
        startTime: null,
        endTime: null,
        moves: 0
    }

    componentDidMount() {
        this.setMapToState();
        this.updateSquareSize();
        document.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener('resize', this.updateSquareSize);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener('resize', this.updateSquareSize);
    }

    /**
     * the square size defines the game size, so resize if needed
     */
    updateSquareSize = () => {
        this.setState({
            squareSize: Math.min(50, Math.floor(Math.min(window.innerWidth, window.innerHeight * 0.8) / 15))
        })
    }

    /**
     * reads the level definition and converts it to the sate varaibles that the game works with
     */
    setMapToState = () => {
        let boxId = 0;
        this.setState(
            {
                worldMap: this.makeWorldMap(this.props.level),
                player: {
                    x: this.props.level.player[0],
                    y: this.props.level.player[1],
                    direction: 'down'
                },
                boxes: this.props.level.startBoxes.map(box => {
                    return {
                        id: boxId++,
                        x: box[0],
                        y: box[1],
                        landed: false
                    }
                })
            }
        );
    }

    /**
     * Handles the key pressed actions
     * @param {*} key 
     */
    keyToDirection(key) {
        switch (key) {
            case 'ArrowUp':
                return { x: 0, y: -1 };
            case 'ArrowDown':
                return { x: 0, y: 1 };
            case 'ArrowRight':
                return { x: 1, y: 0 };
            case 'ArrowLeft':
                return { x: -1, y: 0 };
            default:
                return null;
        }
    }

    /**
     * executes a mode of the player
     */
    playerMove = (direction, steps = 1) => {
        if (!direction) return;
        const x = this.state.player.x + direction.x;
        const y = this.state.player.y + direction.y;
        if (!this.state.worldMap[x] || !this.state.worldMap[x][y]) return;
        if (this.state.worldMap[x][y].type !== 'floor') return;

        const adjacentBox = this.state.boxes.filter(box => ((box.x === x) && (box.y === y)));

        if (adjacentBox.length > 0) {
            const nextX = adjacentBox[0].x + direction.x;
            const nextY = adjacentBox[0].y + direction.y;
            if (this.state.worldMap[nextX][nextY].type !== 'floor') return;
            const followingBox = this.state.boxes.filter(box => ((box.x === nextX) && (box.y === nextY)));
            if (followingBox.length > 0) return;
            const newBoxes = [...this.state.boxes.filter(box => !((box.x === x) && (box.y === y)))]
            newBoxes.push({ ...adjacentBox[0], x: nextX, y: nextY });
            this.setState({ boxes: newBoxes }, () => this.checkIfWin());
        }

        let playerDirection = 'down';
        if (direction.x > 0) playerDirection = 'right';
        if (direction.x < 0) playerDirection = 'left';
        if (direction.y > 0) playerDirection = 'down';
        if (direction.y < 0) playerDirection = 'up';

        this.setState(prevState => {
            return {
                player: { x: x, y: y, direction: playerDirection },
                startTime: prevState.startTime ? prevState.startTime : new Date(),
                moves: prevState.moves + 1
            }
        },
            () => (steps > 1 ? this.playerMove(direction, steps - 1) : null));
    }

    checkIfWin = () => {
        let isWin = true;
        let x, y;
        for ({ x, y } of this.state.boxes) {
            if (!this.state.worldMap[x][y].isLanding) {
                isWin = false;
            }
        }
        if (isWin) {
            this.setState(prevState => ({
                isWin: isWin,
                startTime: prevState.startTime ? prevState.startTime : new Date(),
                endTime: new Date()
            }));
            document.removeEventListener("keydown", this.handleKeyDown);
        }

    }

    handleKeyDown = (event) => {
        this.playerMove(this.keyToDirection(event.key));
    }

    /**
     * allows to use the mouse or toutch to play
     */
    clickHandler = (event, props) => {
        let direction = { x: 0, y: 0 };
        let delta = 0;
        if (props.x === this.state.player.x) {
            delta = (props.y - this.state.player.y);
            if (delta === 0) return;
            direction.y = delta > 0 ? 1 : -1;
        }
        if (props.y === this.state.player.y) {
            delta = (props.x - this.state.player.x);
            if (delta === 0) return;
            direction.x = delta > 0 ? 1 : -1;
        }
        this.playerMove(direction, Math.abs(delta));
    }

    /**
     * Converts the level definition into a two dimmention array that is used to run the game
     * @param {*} level 
     */
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

    render() {

        if (!(this.state.worldMap && this.state.player)) {
            return (
                <div className={classes.GameLevel}>
                    <div>Loading...</div>
                </div>
            );
        }

        const mapSize = (this.state.squareSize * this.props.level.dimension) + 'px';

        const winnerMessage = this.state.isWin
            ? <WinMessage
                level={this.props.level.level}
                nextLevel={this.props.levelHandler}
                lastLevel={this.props.level.isLastLevel}
                moves={this.state.moves}
                time={Math.ceil((this.state.endTime.getTime() - this.state.startTime.getTime()) / 1000)}
            />
            : null;
        return (
            <div className={classes.GameLevel}>
                <div
                    className={classes.PlayGround}
                    style={{ width: mapSize, height: mapSize }}
                >
                    <Map worldMap={this.state.worldMap}
                        clickHandler={this.clickHandler}
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
                    />
                    {winnerMessage}
                </div>


            </div>
        );

    };
};

export default GameLevel;