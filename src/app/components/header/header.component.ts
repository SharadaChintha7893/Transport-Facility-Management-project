import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class HeaderComponent {
  constructor(private router: Router) { }

  bookRide() {
    this.router.navigateByUrl('/riderList');
  }

  addRide() {
    this.router.navigateByUrl('/add');
  }
}
