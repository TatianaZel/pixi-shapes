import { Container, Graphics } from 'pixi.js';
import type { GameModel } from '../models/GameModel';
import { ShapeView } from './ShapeView';

export class GameView extends Container {
  private rectGraphics: Graphics;
  private shapesContainer: Container;
  private maskGraphics: Graphics;

  constructor(private model: GameModel) {
    super();

    this.rectGraphics = new Graphics();
    this.shapesContainer = new Container();
    this.maskGraphics = new Graphics();

    this.addChild(this.rectGraphics);
    this.addChild(this.shapesContainer);

    // ===============================
    // MASK FOR CLIPPING SHAPES TO RECTANGLE
    // ===============================
    this.shapesContainer.mask = this.maskGraphics;
    this.addChild(this.maskGraphics);

    this.drawRect();
    this.updateMask();
  }

  private drawRect() {
    const config = this.model.getConfig();

    this.rectGraphics.clear();
    this.rectGraphics.lineStyle(2, 0xffffff, 1);
    this.rectGraphics.beginFill(0x000000, 0.1);

    this.rectGraphics.drawRect(
      config.rectX,
      config.rectY,
      config.rectWidth,
      config.rectHeight
    );

    this.rectGraphics.endFill();
    this.updateMask();
  }

  // ===============================
  // UPDATE MASK TO MATCH RECTANGLE SIZE
  // ===============================
  private updateMask() {
    const config = this.model.getConfig();

    this.maskGraphics.clear();
    this.maskGraphics.beginFill(0xffffff);
    this.maskGraphics.drawRect(
      config.rectX,
      config.rectY,
      config.rectWidth,
      config.rectHeight
    );
    this.maskGraphics.endFill();
  }

  addShapeView(shapeView: ShapeView) {
    this.shapesContainer.addChild(shapeView);
  }

  removeShapeView(shapeView: ShapeView) {
    this.shapesContainer.removeChild(shapeView);
    shapeView.destroy({ children: true });
  }

  // ===============================
  // GET SHAPES CONTAINER
  // (for using already rendered shapes)
  // ===============================
  getShapesContainer(): Container {
    return this.shapesContainer;
  }

  /**
   * Registers callback for rectangle click.
   * Passes coordinates in global system (this matches current architecture).
   */
  onRectClick(handler: (x: number, y: number) => void) {
    this.rectGraphics.eventMode = 'static';
    this.rectGraphics.interactive = true;

    this.rectGraphics.on('pointerdown', (event) => {
      const global = event.global;
      handler(global.x, global.y);
    });
  }
}
