export class StatsPanelView {
    private countElem: HTMLElement;
    private areaElem: HTMLElement;
  
    constructor() {
      const count = document.getElementById('shapes-count');
      const area = document.getElementById('shapes-area');
  
      if (!count || !area) {
        throw new Error(
          'Statistics elements not found: #shapes-count or #shapes-area'
        );
      }
  
      this.countElem = count;
      this.areaElem = area;
    }
  
    setShapeCount(count: number) {
      this.countElem.textContent = String(count);
    }

    setTotalArea(area: number) {
      // round most logically
      const roundedArea = Math.round(area);
      this.areaElem.textContent = String(roundedArea);
      
      // check element validity (for debugging)
      if (!this.areaElem) {
        console.error('Element #shapes-area not found');
      }
    }
}
  