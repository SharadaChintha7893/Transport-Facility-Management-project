import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RideService } from '../../services/ride.service';
import { Ride } from '../../models/ride.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ride-book',
  templateUrl: './ride-book.component.html',
  styleUrls: ['./ride-book.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RideBookComponent implements OnInit {
  ride?: Ride;
  employeeId = '';
  message = '';

  constructor(private route: ActivatedRoute, private rideService: RideService, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.ride = this.rideService.findById(id);
    if (!this.ride) {
      this.message = 'Ride not found';
    }
  }

  book() {
    if (!this.ride) return;
    this.message = '';
    if (!this.employeeId) {
      this.message = 'Enter Employee ID';
      return;
    }
    const res = this.rideService.bookRide(this.ride.id, this.employeeId);
    if (res.success) {
      this.router.navigateByUrl('/');
    } else {
      this.message = res.message || 'Booking failed';
    }
  }
}
