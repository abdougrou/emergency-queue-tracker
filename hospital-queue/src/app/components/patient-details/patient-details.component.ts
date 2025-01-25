import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { HospitalService } from '../../services/hospital.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.css'
})
export class PatientDetailsComponent {
  private route = inject(ActivatedRoute);
  private hospitalService = inject(HospitalService);
  patient = signal<Patient | null>(null);

  constructor() {
    effect(() => {
      this.route.params.subscribe(params => {
        this.loadPatient(params['id']);
      });
    });
  }

  loadPatient(id: string) {
    this.hospitalService.getPatient(id).subscribe(
      data => this.patient.set(data)
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
