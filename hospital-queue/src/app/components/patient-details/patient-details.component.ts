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
    { step: 1, name: 'Registered'             , description: 'Welcome! You are now registered in our system, and your journey toward care has begun. A nurse will soon assess your condition to ensure you receive the attention you need. Please make yourself comfortable while we prepare the next steps for you.' },
    { step: 2, name: 'Triaged'                , description: 'You’ve been triaged by our medical team, and we’ve assigned a priority level to your care based on your condition. This helps us ensure everyone is treated efficiently and fairly. You’re in good hands—thank you for your patience as we coordinate your care.'},
    { step: 3, name: 'Investigations Pending' , description: 'We’re conducting tests or reviewing results to better understand your condition. This step is crucial to ensuring you receive the right treatment. It may take some time, but rest assured, our team is working diligently to provide you with the best possible care.'},
    { step: 4, name: 'Treatment'              , description: 'You’re now receiving treatment, and our medical team is focused on helping you feel better. If you have any questions or concerns, don’t hesitate to ask. Your health and comfort are our top priorities.'},
    { step: 5, name: 'Admitted'               , description: 'You’ve been admitted to the hospital for further care and monitoring. Our team will guide you through the next steps, and your assigned care team will ensure your needs are met. We’re here to support you every step of the way.'},
    { step: 6, name: 'Discharged'             , description: 'Great news! You’ve been discharged and are ready to continue your recovery at home. We’ll provide any instructions or follow-up information to help you stay on the path to wellness. Take care, and thank you for trusting us with your care.'}
  ];

  constructor() {
    effect(() => {
      this.route.params.subscribe(params => {
        this.loadPatient(params['id']);
      });
    }, { allowSignalWrites: true });
  }

  loadPatient(id: string) {
    this.hospitalService.getPatient(id).subscribe(
      data => {
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

  getStatusClass(status: string, currentStatus: string = ''): string {
    const currentIndex = ['ordered', 'pending', 'reported'].indexOf(currentStatus?.toLowerCase());
    const statusIndex = ['ordered', 'pending', 'reported'].indexOf(status);

    if (statusIndex <= currentIndex) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-600';
  }
}
