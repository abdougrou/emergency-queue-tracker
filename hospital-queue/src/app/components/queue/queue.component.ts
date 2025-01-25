import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QueueResponse } from '../../models/patient.model';
import { HospitalService } from '../../services/hospital.service';
import { StatsComponent } from '../stats/stats.component';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule, RouterModule, StatsComponent],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.css'
})
export class QueueComponent {
  private hospitalService = inject(HospitalService);
  queueData = signal<QueueResponse | null>(null);

  constructor() {
    effect(() => {
      this.loadQueue();
    });
  }

  loadQueue() {
    this.hospitalService.getQueue().subscribe(
      data => this.queueData.set(data)
    );
  }

  getTriageClass(category: number): string {
    const classes: { [key: number]: string } = {
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-red-100 text-red-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-green-100 text-green-800',
      5: 'bg-gray-100 text-gray-800'
    };
    return `px-2 py-1 rounded-full text-sm ${classes[category] || ''}`;
  }
}
