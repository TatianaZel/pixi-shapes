import type { IShapeModel } from './IShapeModel';
import type { GameConfig } from '../core/GameConfig';

/**
 * GameModel — central data model.
 * Stores list of all shapes and game configuration (gravity, spawn rate).
 */
export class GameModel {
  private shapes: IShapeModel[] = [];
  private nextId = 1;

  constructor(private config: GameConfig) {}

  // === CONFIG ===

  getConfig(): GameConfig {
    return this.config;
  }

  getGravity(): number {
    return this.config.gravity;
  }

  getShapesPerSecond(): number {
    return this.config.shapesPerSecond;
  }

  setGravity(value: number): void {
    this.config.gravity = Math.max(0, value);
  }

  setShapesPerSecond(value: number): void {
    this.config.shapesPerSecond = Math.max(0, value);
  }

  // === SHAPES ===

  getShapes(): readonly IShapeModel[] {
    return this.shapes;
  }

  addShape(shape: Omit<IShapeModel, 'id'>): IShapeModel {
    const newShape: IShapeModel = {
      ...shape,
      id: this.nextId++,
    };

    this.shapes.push(newShape);
    return newShape;
  }

  removeShapeById(id: number): void {
    const index = this.shapes.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.shapes.splice(index, 1);
    }
  }

  clearShapes(): void {
    this.shapes = [];
  }

  getShapeCount(): number {
    return this.shapes.length;
  }

  // getTotalArea(): number {
  //   return this.shapes.reduce((sum, shape) => sum + shape.area, 0);
  // }
}
