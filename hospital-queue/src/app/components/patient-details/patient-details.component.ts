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
  phases = [
    { step: 1, name: 'Registered'             , description: 'Initial registration complete' },
    { step: 2, name: 'Triaged'                , description: 'Triage assessment complete'},
    { step: 3, name: 'Investigations Pending' , description: 'Tests/imaging ordered'},
    { step: 4, name: 'Treatment'              , description: 'Receiving treatment'},
    { step: 5, name: 'Admitted'               , description: 'Being admitted to hospital'},
    { step: 6, name: 'Discharged'             , description: 'Discharge process complete'}
  ];

  constructor() {
    effect(() => {
      this.route.params.subscribe(params => {
        this.loadPatient(params['id']);
      });
    }, { allowSignalWrites: true });
  }

  loadPatient(id: string) {
    console.log("Load Patient Request Sent")
    this.hospitalService.getPatient(id).subscribe(
      data => {
        console.log("Server Respnse: ");
        console.log(data);
        this.patient.set(data);
      }
    );
  }

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')} Hr`;
  }

  getCategoryName(category: number): string {
    const names: { [key: number]: string } = {
      1: 'Blue',
      2: 'Red',
      3: 'Yellow',
      4: 'Green',
      5: 'White'
    };
    return names[category] || '';
  }
  
  getCategoryDescription(category: number): string {
    const descriptions: { [key: number]: string } = {
      1: 'Requires immediate care',
      2: 'Requires rapid care',
      3: 'Requires urgent care',
      4: 'Requires less-urgent care',
      5: 'Requires non-urgent care'
    };
    return descriptions[category] || '';
  }

  getAverageWaitTime(category: number): number {
    const averageTimes: { [key: number]: number } = {
      1: 5,    // 0-5 mins for CTAS 1
      2: 23,   // 15-30 mins for CTAS 2
      3: 75,   // 30-120 mins for CTAS 3
      4: 150,  // 60-240 mins for CTAS 4
      5: 240   // 120-360 mins for CTAS 5
    };
    return averageTimes[category] || 0;
  }

  getPhaseDescription(phase: string = ''): string {
    const currentPhase = this.phases.find(p => 
      p.name.toLowerCase() === phase.toLowerCase().replace('_', ' ')
    );
    return currentPhase?.description || '';
  }
  
  getProgressWidth(currentPhase: string = ''): string {
    const currentStep = this.phases.findIndex(p => 
      p.name.toLowerCase() === currentPhase.toLowerCase().replace('_', ' ')) + 1;
    return `${(currentStep - 1) * 20}%`;
  }
  
  getPhasePointClass(step: number, currentPhase: string = ''): string {
    const currentStep = this.phases.findIndex(p => 
      p.name.toLowerCase() === currentPhase.toLowerCase().replace('_', ' ')) + 1;
    
    if (step < currentStep) {
      return 'bg-blue-500 text-white';
    } else if (step === currentStep) {
      return 'bg-blue-500 text-white ring-4 ring-blue-200';
    }
    return 'bg-gray-200 text-gray-600';
  }
}
