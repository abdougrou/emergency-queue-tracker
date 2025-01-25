import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Stats } from 'fs';
import { Observable } from 'rxjs';
import { QueueResponse, Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1';

  getQueue(sort: string = 'arrival_time'): Observable<QueueResponse> {
    return this.http.get<QueueResponse>(`${this.apiUrl}/queue?sort=${sort}`);
  }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.apiUrl}/stats/current`);
  }

  getPatient(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/patient/${id}`);
  }
}
