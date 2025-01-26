import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Cell } from '../../models/cell.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

interface OppositeWalls {
  top: 'bottom';
  right: 'left'; 
  bottom: 'top';
  left: 'right';
}

interface MoveConfig {
  dx: number;
  dy: number;
  wall: string;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})

export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('mazeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('easyBtn') easyBtnRef!: ElementRef;
  @ViewChild('mediumBtn') mediumBtnRef!: ElementRef;
  @ViewChild('hardBtn') hardBtnRef!: ElementRef;

  private ctx!: CanvasRenderingContext2D;
  patientId: string = '';

  cellSize = 20;
  cols: number = 0;
  rows: number = 0;
  cells: any[][] = [];
  player = { x: 0, y: 0 };
  end = { x: 0, y: 0 };
  trail: any[] = [];
  points = 0;
  
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.patientId = params['id'];
    });
  }

  ngOnInit() {
    this.cols = Math.floor(400 / this.cellSize);
    this.rows = Math.floor(400 / this.cellSize);
    this.end = { x: this.cols - 1, y: this.rows - 1 };
    this.initializeCells();
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
      // Only setup game after DOM is available
      setTimeout(() => {
        this.setupGame();
      });
    }
  }

  setupGame() {
    this.initializeCells();
    this.generateMaze(0, 0);
    this.draw();
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
  }

  setDifficulty(level: string) {
    const buttons = {
      easy: this.easyBtnRef,
      medium: this.mediumBtnRef,
      hard: this.hardBtnRef
    };
 
    Object.values(buttons).forEach(btn => 
      btn.nativeElement.style.backgroundColor = 'hsl(204, 100%, 97%)');
 
    switch(level) {
      case 'easy':
        this.cellSize = 50;
        buttons.easy.nativeElement.style.backgroundColor = 'hsl(201, 18%, 85%)';
        break;
      case 'medium':
        this.cellSize = 40;
        buttons.medium.nativeElement.style.backgroundColor = 'hsl(201, 18%, 85%)';
        break;
      case 'hard':
        this.cellSize = 20;
        buttons.hard.nativeElement.style.backgroundColor = 'hsl(201, 18%, 85%)';
        break;
    }
 
    this.cols = Math.floor(400 / this.cellSize);
    this.rows = Math.floor(400 / this.cellSize);
    this.end = { x: this.cols - 1, y: this.rows - 1 };
  }

  startGame() {
    this.resetGame();
    this.setupGame();
  }

  resetGame() {
    this.player = { x: 0, y: 0 };
    this.points = 0;
    this.trail = [];
    this.clearScreen();
  }

  handleKeyPress(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (['w','a','s','d'].includes(key)) {
      this.movePlayer(key);
      this.draw();
    }
  }
 
  initializeCells() {
    this.cells = [];
    for (let x = 0; x < this.cols; x++) {
      this.cells[x] = [];
      for (let y = 0; y < this.rows; y++) {
        this.cells[x][y] = new Cell(x, y);
      }
    }
  }
 
  generateMaze(x: number, y: number) {
    const currentCell = this.cells[x][y];
    currentCell.visited = true;
 
    const directions = this.randomize(['top', 'right', 'bottom', 'left']);
    const moves: {[key: string]: {[key: string]: number}} = {
      top: { dx: 0, dy: -1 },
      right: { dx: 1, dy: 0 },
      bottom: { dx: 0, dy: 1 },
      left: { dx: -1, dy: 0 }
    };
    const oppositeWall = {
      top: 'bottom',
      right: 'left',
      bottom: 'top', 
      left: 'right'
     } as const;
 
    directions.forEach(dir => {
      const newX = x + moves[dir]['dx'];
      const newY = y + moves[dir]['dy'];
 
      if (this.isValidCell(newX, newY)) {
        const neighbor = this.cells[newX][newY];
        if (!neighbor.visited) {
          currentCell.walls[dir] = false;
          neighbor.walls[oppositeWall[dir as keyof OppositeWalls]] = false;
          this.generateMaze(newX, newY);
        }
      }
    });
  }
 
  movePlayer(key: string) {
    const moves: Record<string, MoveConfig> = {
      w: { dx: 0, dy: -1, wall: 'top' },
      s: { dx: 0, dy: 1, wall: 'bottom' },
      a: { dx: -1, dy: 0, wall: 'left' },
      d: { dx: 1, dy: 0, wall: 'right' }
    };
   
    const move = moves[key];
    const currentCell = this.cells[this.player.x][this.player.y];
    
    if (!currentCell.walls[move.wall]) {
      const newX = this.player.x + (move.dx as number);
      const newY = this.player.y + (move.dy as number);
      
      if (this.isValidCell(newX, newY)) {
        this.player.x = newX;
        this.player.y = newY;
        this.points++;
        this.trail.push({ x: newX, y: newY });
        this.checkWin();
      }
    }
   }
 
  draw() {
    this.clearScreen();
    
    // Draw maze
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.cells[x][y].show(this.ctx, this.cellSize);
      }
    }
 
    // Draw trail
    if (this.trail.length > 0) {
      this.ctx.beginPath();
      this.trail.forEach((pos, i) => {
        const x = pos.x * this.cellSize + this.cellSize / 2;
        const y = pos.y * this.cellSize + this.cellSize / 2;
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      });
      this.ctx.strokeStyle = 'blue';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
 
    // Draw player
    this.drawPlayer();
    
    // Draw end point
    this.drawEnd();
  }
 
  drawPlayer() {
    const x = this.player.x * this.cellSize + this.cellSize / 2;
    const y = this.player.y * this.cellSize + this.cellSize / 2;

    this.ctx.beginPath();
    this.ctx.arc(x, y, this.cellSize / 3, 0, Math.PI * 2);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
  }
 
  drawEnd() {
    const x = this.end.x * this.cellSize + this.cellSize / 2;
    const y = this.end.y * this.cellSize + this.cellSize / 2;

    this.ctx.beginPath();
    this.ctx.arc(x, y, this.cellSize / 3, 0, Math.PI * 2);
    this.ctx.fillStyle = 'green';
    this.ctx.fill();
  }
 
  checkWin() {
    if (this.player.x === this.end.x && this.player.y === this.end.y) {
      const msgBox = document.querySelector('.msgbox') as HTMLElement;
      msgBox.innerHTML = `
        <h1>You Won!</h1>
        <h2>Moves: ${this.points}</h2>
        <button onclick="location.reload()">Play Again</button>
      `;
      msgBox.style.visibility = 'visible';
      document.removeEventListener('keydown', this.handleKeyPress.bind(this));
    }
  }
 
  clearScreen() {
    this.ctx.clearRect(0, 0, 400, 400);
  }
 
  isValidCell(x: number, y: number): boolean {
    return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
  }
 
  randomize<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }
}
