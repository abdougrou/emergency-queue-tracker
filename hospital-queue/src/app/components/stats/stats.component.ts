import { Component, effect, inject, signal } from '@angular/core';
import { Stats } from '../../models/patient.model';
import { HospitalService } from '../../services/hospital.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {
  private hospitalService = inject(HospitalService);
  stats = signal<Stats | null>(null);
  categories = [1, 2, 3, 4, 5];

  constructor() {
    effect(() => {
      this.loadStats();
    }, { allowSignalWrites: true });
  }

  loadStats() {
    this.hospitalService.getStats().subscribe(
      data => this.stats.set(data)
    );
  }
}
