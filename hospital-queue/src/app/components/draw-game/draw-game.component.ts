import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-draw-game',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './draw-game.component.html',
  styleUrl: './draw-game.component.css'
})

export class DrawGameComponent {
  @ViewChild('drawingCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('colorPicker') colorPickerRef!: ElementRef<HTMLInputElement>;
 
  patientId: string = '';
  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  private pencilColor = '#000000';
  grade = '';
 
  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
      this.setupCanvas();
      this.addEventListeners();
    }
  }
 
  private setupCanvas() {
    this.ctx.lineWidth = 5;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.pencilColor;
  }
 
  private addEventListeners() {
    const canvas = this.canvasRef.nativeElement;
 
    canvas.addEventListener('mousedown', (e) => {
      this.drawing = true;
      this.ctx.beginPath();
      this.ctx.moveTo(e.offsetX, e.offsetY);
    });
 
    canvas.addEventListener('mousemove', (e) => {
      if (this.drawing) {
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.stroke();
      }
    });
 
    canvas.addEventListener('mouseup', () => {
      this.drawing = false;
    });
 
    canvas.addEventListener('mouseout', () => {
      this.drawing = false;
    });
  }

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.patientId = params['id'];
    });
  }
 
  updateColor(event: Event) {
    this.pencilColor = (event.target as HTMLInputElement).value;
    this.ctx.strokeStyle = this.pencilColor;
  }
 
  clearCanvas() {
    this.ctx.clearRect(
      0, 0, 
      this.canvasRef.nativeElement.width, 
      this.canvasRef.nativeElement.height
    );
  }
 
  gradeDrawing() {
    const result = Math.floor(Math.random() * 6) + 5;
    this.grade = `${result}/10`;
  }
}
