import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
  { 
    path: 'queue',
    loadComponent: () => import('./components/queue/queue.component')
      .then(m => m.QueueComponent)
  },
  {
    path: 'patient/:id',
    loadComponent: () => import('./components/patient-details/patient-details.component')
      .then(m => m.PatientDetailsComponent)
  },
  {
    path: 'game/:id', 
    loadComponent: () => import('./components/game/game.component').then(m => m.GameComponent)
  },
  {
    path: 'draw-game/:id', 
    loadComponent: () => import('./components/draw-game/draw-game.component').then(m => m.DrawGameComponent)
  }
];
