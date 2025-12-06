import { ShapeType } from './ShapeType';

export interface IShapeModel {
  id: number;
  type: ShapeType;

  // Position
  x: number;
  y: number;

  // Velocity (currently only Y, but keeping X for future use)
  vx: number;
  vy: number;

  // Rotation angle (in radians)
  rotation: number;

  // Color in HEX, e.g. 0xff0000
  color: number;

  // Additional parameters for specific shape
  width: number;
  height: number;
  radiusX: number;
  radiusY: number;

  polygonPoints?: { x: number; y: number }[];
}
