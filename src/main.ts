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

  // Position panels relative to rectangle
  const updatePanelPositions = () => {
    const config = gameModel.getConfig();
    const topPanel = document.getElementById('top-panel');
    const bottomPanel = document.getElementById('bottom-panel');

    if (topPanel) {
      const topPanelHeight = topPanel.getBoundingClientRect().height || 40;
      topPanel.style.left = `${config.rectX}px`;
      topPanel.style.top = `${config.rectY - topPanelHeight}px`;
    }

    if (bottomPanel) {
      bottomPanel.style.left = `${config.rectX}px`;
      bottomPanel.style.top = `${config.rectY + config.rectHeight}px`;
    }
  };

  // Initial positioning (use requestAnimationFrame to ensure DOM is ready)
  requestAnimationFrame(() => {
    updatePanelPositions();
  });

  // Update positions on window resize
  window.addEventListener('resize', () => {
    requestAnimationFrame(updatePanelPositions);
  });

  // Main game loop
  app.ticker.add((ticker) => {
    const deltaSeconds = ticker.deltaMS / 1000;
    gameController.update(deltaSeconds);
  });
})();
