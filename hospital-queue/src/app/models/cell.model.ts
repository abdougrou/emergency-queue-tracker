export class Cell {
    x: number;
    y: number;
    visited: boolean = false;
    walls = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
 
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
 
    show(ctx: CanvasRenderingContext2D, cellSize: number) {
      const x = this.x * cellSize;
      const y = this.y * cellSize;
 
      ctx.beginPath();
      if (this.walls.top) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
      }
      if (this.walls.right) {
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
      }
      if (this.walls.bottom) {
        ctx.moveTo(x + cellSize, y + cellSize);
        ctx.lineTo(x, y + cellSize);
      }
      if (this.walls.left) {
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
