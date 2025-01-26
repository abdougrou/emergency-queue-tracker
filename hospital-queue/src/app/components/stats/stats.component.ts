import { AfterViewInit, Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Stats } from '../../models/patient.model';
import { HospitalService } from '../../services/hospital.service';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {
  private hospitalService = inject(HospitalService);
  stats = signal<Stats | null>(null);
  donutSeries = signal<number[]>([]);
  barSeries = signal<number[]>([]);
  donutLabels = ['CTAS 1', 'CTAS 2', 'CTAS 3', 'CTAS 4', 'CTAS 5'];
  barLabels = ['CTAS 1', 'CTAS 2', 'CTAS 3', 'CTAS 4', 'CTAS 5'];


  constructor() {
    effect(() => {
      this.loadStats();
    }, { allowSignalWrites: true });
  }

  loadStats() {
    this.hospitalService.getStats().subscribe(
      data => {
        this.stats.set(data);
        this.updateCharts(data);
      });
  }

  updateCharts(data: Stats) {
    this.donutSeries.set([
      data.categoryBreakdown[1] || 0,
      data.categoryBreakdown[2] || 0,
      data.categoryBreakdown[3] || 0,
      data.categoryBreakdown[4] || 0,
      data.categoryBreakdown[5] || 0
    ]);
    
    this.barSeries.set([
      data.averageWaitTimes[1] || 0,
      data.averageWaitTimes[2] || 0,
      data.averageWaitTimes[3] || 0,
      data.averageWaitTimes[4] || 0,
      data.averageWaitTimes[5] || 0
    ]);
  }
}
