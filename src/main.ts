import './style.css';
import { Application } from 'pixi.js';
import { DEFAULT_GAME_CONFIG } from './core/GameConfig';
import { GameModel } from './models/GameModel';
import { GameController } from './controllers/GameController';
import { StatsPanelView } from './ui/StatsPanelView';
import { ControlsPanelView } from './ui/ControlsPanelView';

(async () => {
  // Initialize PIXI
  const app = new Application();
  await app.init({
    background: '#202533',
    resizeTo: window,
    antialias: true,
  });

  // Place canvas
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    throw new Error('Element #app not found');
  }
  appContainer.appendChild(app.canvas);

  // Game model (data)
  const gameModel = new GameModel({ ...DEFAULT_GAME_CONFIG });

  // UI panels
  const statsView = new StatsPanelView();
  const controlsView = new ControlsPanelView(
    gameModel.getShapesPerSecond(),
    gameModel.getGravity(),
  );

  // Game controller (business logic)
  const gameController = new GameController(app, gameModel, statsView);

  // Connect controls through UI
  controlsView.onShapesPerSecondChange((value) => {
    gameModel.setShapesPerSecond(value);
  });

  controlsView.onGravityChange((value) => {
    gameModel.setGravity(value);
  });

  // Main game loop
  app.ticker.add((ticker) => {
    const deltaSeconds = ticker.deltaMS / 1000;
    gameController.update(deltaSeconds);
  });
})();
