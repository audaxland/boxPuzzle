import level1 from './level1';
import level2 from './level2';
import level3 from './level3';
import level4 from './level4';
import level5 from './level5';
import level6 from './level6';
import level7 from './level7';
import level8 from './level8';
import level9 from './level9';

const defaultLevel = {
    dimension: 15,
    floor: [[7, 7]],
    startBoxes: [],
    endBoxes: [],
    player: [7, 7],
}

const levels = [
    { level: 1, ...defaultLevel, ...level1 },
    { level: 2, ...defaultLevel, ...level2 },
    { level: 3, ...defaultLevel, ...level3 },
    { level: 4, ...defaultLevel, ...level4 },
    { level: 5, ...defaultLevel, ...level5 },
    { level: 6, ...defaultLevel, ...level6 },
    { level: 7, ...defaultLevel, ...level7 },
    { level: 8, ...defaultLevel, ...level8 },
    { level: 9, ...defaultLevel, ...level9 }
];


export default levels;