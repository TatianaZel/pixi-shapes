type ChangeHandler = (newValue: number) => void;

export class ControlsPanelView {
  private shapesInput: HTMLInputElement;
  private gravityInput: HTMLInputElement;

  private onShapesChangeHandler?: ChangeHandler;
  private onGravityChangeHandler?: ChangeHandler;

  constructor(initialShapesPerSecond: number, initialGravity: number) {
    const shapesDec = document.getElementById('btn-shapes-dec');
    const shapesInc = document.getElementById('btn-shapes-inc');
    const gravityDec = document.getElementById('btn-gravity-dec');
    const gravityInc = document.getElementById('btn-gravity-inc');

    const shapesInput = document.getElementById('shapes-per-second-input') as HTMLInputElement | null;
    const gravityInput = document.getElementById('gravity-input') as HTMLInputElement | null;

    if (!shapesDec || !shapesInc || !gravityDec || !gravityInc || !shapesInput || !gravityInput) {
      throw new Error('Control panel elements not found');
    }

    this.shapesInput = shapesInput;
    this.gravityInput = gravityInput;

    // Set initial values
    this.setShapesPerSecond(initialShapesPerSecond);
    this.setGravity(initialGravity);

    // --- BUTTON HANDLERS ---

    shapesDec.addEventListener('click', () => {
      this.updateShapes(this.getShapesPerSecond() - 1);
    });

    shapesInc.addEventListener('click', () => {
      this.updateShapes(this.getShapesPerSecond() + 1);
    });

    gravityDec.addEventListener('click', () => {
      this.updateGravity(this.getGravity() - 10);
    });

    gravityInc.addEventListener('click', () => {
      this.updateGravity(this.getGravity() + 10);
    });

    // --- INPUT HANDLERS (manual entry) ---

    this.shapesInput.addEventListener('change', () => {
      this.updateShapes(this.getShapesPerSecond());
    });

    this.gravityInput.addEventListener('change', () => {
      this.updateGravity(this.getGravity());
    });

    // Enter → trigger blur/norm
    this.shapesInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.shapesInput.blur();
    });

    this.gravityInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.gravityInput.blur();
    });
  }

  // ========================================
  // PUBLIC SUBSCRIPTIONS
  // ========================================
  onShapesPerSecondChange(handler: ChangeHandler) {
    this.onShapesChangeHandler = handler;
  }

  onGravityChange(handler: ChangeHandler) {
    this.onGravityChangeHandler = handler;
  }

  // ========================================
  // INTERNAL HELPERS
  // ========================================

  private updateShapes(value: number) {
    const normalized = Math.max(0, Math.floor(value));
    this.setShapesPerSecond(normalized);
    this.onShapesChangeHandler?.(normalized);
  }

  private updateGravity(value: number) {
    const normalized = Math.max(0, Math.floor(value));
    this.setGravity(normalized);
    this.onGravityChangeHandler?.(normalized);
  }

  // ========================================
  // VALUE GETTERS / SETTERS
  // ========================================

  setShapesPerSecond(value: number) {
    this.shapesInput.value = Math.max(0, Math.floor(value)).toString();
  }

  setGravity(value: number) {
    this.gravityInput.value = Math.max(0, Math.floor(value)).toString();
  }

  getShapesPerSecond(): number {
    const v = Number(this.shapesInput.value);
    return Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;
  }

  getGravity(): number {
    const v = Number(this.gravityInput.value);
    return Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;
  }
}
