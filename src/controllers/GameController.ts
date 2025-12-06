import type { Application } from 'pixi.js';
import type { GameModel } from '../models/GameModel';
import type { IShapeModel } from '../models/IShapeModel';
import { ShapeType } from '../models/ShapeType';
import { GameView } from '../views/GameView';
import { ShapeView } from '../views/ShapeView';
import { StatsPanelView } from '../ui/StatsPanelView';


export class GameController {
  private gameView: GameView;
  private spawnTimer = 0;
  private shapeViews: Map<number, ShapeView> = new Map();

  constructor(
    private app: Application,
    private model: GameModel,
    private statsView: StatsPanelView,
  ) {
    this.gameView = new GameView(this.model);
    this.app.stage.addChild(this.gameView);

    // click on empty space in rectangle
    this.gameView.onRectClick((x, y) => {
      this.handleRectClick(x, y);
    });
  }

  // ===============================
  // SHAPE MODEL FACTORY
  // ===============================
  private createShapeModel(x: number, y: number): Omit<IShapeModel, 'id'> {
    const type = this.randomType();
    const baseSize = 30 + Math.random() * 40;
    
    // ===============================
    // SHAPE COLOR GENERATION
    // (ensure color doesn't match background #202533)
    // ===============================
    const BACKGROUND_COLOR = 0x202533; // application background color
    let color: number;
    do {
      color = Math.floor(Math.random() * 0xffffff);
    } while (color === BACKGROUND_COLOR); // ensure color doesn't match background

    let width = baseSize;
    let height = baseSize;
    let radiusX = baseSize / 2;
    let radiusY = baseSize / 2;
    let polygonPoints: { x: number; y: number }[] | undefined;

    // -------- CIRCLE --------
    if (type === ShapeType.Circle) {
      const r = baseSize / 2;
      radiusX = radiusY = r;
      width = height = r * 2;

      return { type, x, y, vx: 0, vy: 0, rotation: 0, color, width, height, radiusX, radiusY };
    }

    // -------- ELLIPSE --------
    if (type === ShapeType.Ellipse) {
      radiusX = baseSize / 2;
      radiusY = baseSize / 3;
      width = radiusX * 2;
      height = radiusY * 2;

      return { type, x, y, vx: 0, vy: 0, rotation: 0, color, width, height, radiusX, radiusY };
    }

    // -------- POLYGONS: Triangle, Quad, Pentagon, Hexagon --------
    const vertexCounts: Record<ShapeType, number> = {
      [ShapeType.Triangle]: 3,
      [ShapeType.Quad]: 4,
      [ShapeType.Pentagon]: 5,
      [ShapeType.Hexagon]: 6,
      [ShapeType.Random]: 0,
      [ShapeType.Circle]: 0,
      [ShapeType.Ellipse]: 0,
    };

    const sides = vertexCounts[type];

    if (sides > 0) {
      const maxR = baseSize / 2;
      const minR = maxR * 0.5;

      polygonPoints = [];

      for (let i = 0; i < sides; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
        const r = minR + Math.random() * (maxR - minR);
        polygonPoints.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
      }

      width = height = maxR * 2;
      radiusX = radiusY = maxR;

      return {
        type, x, y, vx: 0, vy: 0, rotation: 0, color,
        width, height, radiusX, radiusY,
        polygonPoints
      };
    }

    // -------- RANDOM ORGANIC BLOB --------
    if (type === ShapeType.Random) {
      radiusX = baseSize / 2;
      radiusY = baseSize / 2 * (0.5 + Math.random() * 0.5);

      width = radiusX * 2;
      height = radiusY * 2;

      return {
        type, x, y, vx: 0, vy: 0, rotation: 0,
        color, width, height, radiusX, radiusY
      };
    }

    // fallback
    return { type, x, y, vx: 0, vy: 0, rotation: 0, color, width, height, radiusX, radiusY };
  }

  private randomType(): ShapeType {
    const types = Object.values(ShapeType);
    return types[Math.floor(Math.random() * types.length)];
  }

  // ===============================
  // ADD SHAPE TO SCENE
  // ===============================
  private addShapeToScene(model: IShapeModel) {
    const view = new ShapeView(model);
    this.shapeViews.set(model.id, view);
    this.gameView.addShapeView(view);

    view.on('pointerdown', (event: any) => {
      event?.stopPropagation?.();
      this.removeShape(model.id);
    });
  }

  private removeShape(id: number) {
    this.model.removeShapeById(id);
    const view = this.shapeViews.get(id);

    if (view) {
      this.gameView.removeShapeView(view);
      this.shapeViews.delete(id);
    }
  }

  // ===============================
  // SPAWN FROM TOP
  // ===============================
  private spawnShape() {
    const config = this.model.getConfig();
    const x = config.rectX + Math.random() * config.rectWidth;
    const y = config.rectY - 40;

    const model = this.model.addShape(this.createShapeModel(x, y));
    this.addShapeToScene(model);
  }

  // ===============================
  // CLICK INSIDE RECTANGLE
  // ===============================
  private handleRectClick(x: number, y: number) {
    const model = this.model.addShape(this.createShapeModel(x, y));
    this.addShapeToScene(model);
  }

  // ===============================
  // CHECK SHAPE INTERSECTION WITH RECTANGLE
  // ===============================
  private shapeIntersectsRect(shape: IShapeModel, rectX: number, rectY: number, rectWidth: number, rectHeight: number): boolean {
    // Calculate shape bounding box
    // For simplicity, use width/height and radiusX/radiusY as approximation
    const shapeRadius = Math.max(shape.radiusX, shape.radiusY);
    const shapeHalfWidth = shape.width / 2;
    const shapeHalfHeight = shape.height / 2;
    
    // Use maximum size to account for rotation
    const maxExtent = Math.max(shapeHalfWidth, shapeHalfHeight, shapeRadius);
    
    const shapeLeft = shape.x - maxExtent;
    const shapeRight = shape.x + maxExtent;
    const shapeTop = shape.y - maxExtent;
    const shapeBottom = shape.y + maxExtent;
    
    const rectLeft = rectX;
    const rectRight = rectX + rectWidth;
    const rectTop = rectY;
    const rectBottom = rectY + rectHeight;
    
    // Check bounding box intersection
    return !(shapeRight < rectLeft || shapeLeft > rectRight || shapeBottom < rectTop || shapeTop > rectBottom);
  }


  // ===============================
  // UPDATE EVERY FRAME
  // ===============================
  update(deltaSeconds: number) {
    const gravity = this.model.getGravity();
    const shapesPerSecond = this.model.getShapesPerSecond();

    // spawn timer
    if (shapesPerSecond > 0) {
      const interval = 1 / shapesPerSecond;
      this.spawnTimer += deltaSeconds;

      while (this.spawnTimer >= interval) {
        this.spawnTimer -= interval;
        this.spawnShape();
      }
    }

    // shape falling
    const config = this.model.getConfig();

    for (const shape of [...this.model.getShapes()]) {
      shape.y += gravity * deltaSeconds;

      const bottomLimit = config.rectY + config.rectHeight + 100;
      if (shape.y > bottomLimit) {
        this.removeShape(shape.id);
        continue;
      }

      this.shapeViews.get(shape.id)?.syncWithModel();
    }

    // statistics
    
    // ===============================
    // COUNT SHAPES INTERSECTING WITH RECTANGLE
    // ===============================
    const intersectingShapes = this.model.getShapes().filter(shape =>
      this.shapeIntersectsRect(shape, config.rectX, config.rectY, config.rectWidth, config.rectHeight)
    );
    this.statsView.setShapeCount(intersectingShapes.length);
  }

}
