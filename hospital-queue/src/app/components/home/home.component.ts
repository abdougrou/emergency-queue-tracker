import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  ticketId: string = '';
 constructor(private router: Router) {}

 verifyTicket() {
   if (this.ticketId) {
     this.router.navigate(['/patient', this.ticketId]);
   }
 }
}
