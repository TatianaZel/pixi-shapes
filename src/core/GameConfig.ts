export interface GameConfig {
    // Rectangular area where shapes are displayed
    rectX: number;
    rectY: number;
    rectWidth: number;
    rectHeight: number;
  
    // Initial settings
    gravity: number;          // Gravity (falling speed)
    shapesPerSecond: number;  // Number of shapes generated per second
  }
  
  // Default values (can be changed later)
  export const DEFAULT_GAME_CONFIG: GameConfig = {
    rectX: 100,
    rectY: 100,
    rectWidth: 800,
    rectHeight: 500,
  
    gravity: 10,        // pixels/sec (falling speed)
    shapesPerSecond: 1,  // 1 new shape per second
  };
  