import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/queue', pathMatch: 'full' },
  { 
    path: 'queue',
    loadComponent: () => import('./components/queue/queue.component')
      .then(m => m.QueueComponent)
  },
  {
    path: 'patient/:id',
    loadComponent: () => import('./components/patient-details/patient-details.component')
      .then(m => m.PatientDetailsComponent)
  }
];
