import React from 'react';
import './App.css';
import Game from './components/Game/Game';
import LevelMaker from './components/LeverMaker/LevelMaker';
import defaultLevels from './assets/levels/levels';


class App extends React.Component {

  state = {
    levels: [],
    mode: 'game',
    startLevel: 0
  }

  componentDidMount() {
    // Load the levels from the level files in the assets directory
    this.setState({
      levels: defaultLevels.map(this.formatLevel)
    });
  }

  /**
   * add the array index to the level object
   */
  formatLevel = (level, index) => ({
    ...level,
    index
  });

  /**
   * Add a new custom level from the LevelMaker
   */
  addCustomLevel = newLevel => {
    this.setState(({ levels }) => {
      const maxLevel = levels.reduce((levelNumber, level) => Math.max(levelNumber, level.level), 1);
      return {
        levels: [
          ...levels,
          this.formatLevel({
            ...newLevel,
            level: (maxLevel + 1),
          }, levels.length)
        ],
        startLevel: levels.length
      };
    })
  }

  /**
   * switch between the game and the level maker
   */
  switchGameMode = mode => {
    this.setState({ mode });
  }

  render() {
    return (
      <div className="App">
        {this.state.mode === 'game' && <Game
          levels={this.state.levels}
          switchGameMode={this.switchGameMode}
          startLevel={this.state.startLevel}
        />}
        {this.state.mode === 'levelMaker' && <LevelMaker
          addCustomLevel={this.addCustomLevel}
          switchGameMode={this.switchGameMode}
        />}
      </div>
    );

  }
}

export default App;
