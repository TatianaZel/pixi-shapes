import { Graphics } from 'pixi.js';
import type { IShapeModel } from '../models/IShapeModel';
import { ShapeType } from '../models/ShapeType';

export class ShapeView extends Graphics {
  constructor(public readonly model: IShapeModel) {
    super();

    this.interactive = true;
    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.x = model.x;
    this.y = model.y;
    this.rotation = model.rotation;

    this.draw();
  }

  /**
   * Draws polygon based on model's polygonPoints.
   */
  private drawPolygonFromModel() {
    const pts = this.model.polygonPoints;
    if (!pts || pts.length < 3) return;

    const flat: number[] = [];
    for (const p of pts) {
      flat.push(p.x, p.y);
    }

    this.drawPolygon(flat);
  }


  /**
   * Draws "cloud" for ShapeType.Random — several overlapping circles.
   * Assumes beginFill has already been called with the desired color.
   */
  private drawCloud() {
    // Base radius from model (X/Y axis) to make cloud approximately the size of the shape
    const baseR = Math.min(this.model.radiusX, this.model.radiusY) || Math.min(this.model.width, this.model.height) / 2;

    // Number of "bubbles" in cloud: 3–5
    const bubbleCount = 3 + Math.floor(Math.random() * 3);

    for (let i = 0; i < bubbleCount; i++) {
      // Radius of each bubble: 50–110% of base
      const r = baseR * (0.5 + Math.random() * 0.6);

      // Bubble center offset from (0,0)
      const angle = Math.random() * Math.PI * 2;
      const dist = baseR * (0.2 + Math.random() * 0.4); // slightly around center

      const cx = Math.cos(angle) * dist;
      const cy = Math.sin(angle) * dist;

      this.drawCircle(cx, cy, r);
    }
  }


  draw() {
    this.clear();
    this.beginFill(this.model.color);

    switch (this.model.type) {
      case ShapeType.Circle: {
        const r = this.model.radiusX;
        this.drawCircle(0, 0, r);
        break;
      }

      case ShapeType.Ellipse: {
        this.drawEllipse(0, 0, this.model.radiusX, this.model.radiusY);
        break;
      }

      case ShapeType.Triangle:
      case ShapeType.Quad:
      case ShapeType.Pentagon:
      case ShapeType.Hexagon:
        this.drawPolygonFromModel();
        break;

      case ShapeType.Random:
        this.drawCloud();
        break;

      default:
        // fallback — rect by bounding box
        this.drawRect(
          -this.model.width / 2,
          -this.model.height / 2,
          this.model.width,
          this.model.height,
        );
    }

    this.endFill();
  }

  syncWithModel() {
    this.x = this.model.x;
    this.y = this.model.y;
    this.rotation = this.model.rotation;
  }
}
