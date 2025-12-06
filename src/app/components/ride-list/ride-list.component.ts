import { Component, OnInit } from '@angular/core';
import { RideService } from '../../services/ride.service';
import { Ride } from '../../models/ride.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ride-list',
  templateUrl: './ride-list.component.html',
  styleUrls: ['./ride-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RideListComponent implements OnInit {
  rides: Ride[] = [];
  filtered: Ride[] = [];
  vehicleTypeFilter: string | undefined;
  rides$: any;

  constructor(private rideService: RideService, private router: Router) { }

  ngOnInit(): void {
    this.rides = this.rideService.getAll();
    console.log(this.rides)
    this.filtered = this.rides;
    this.rideService.rides$.subscribe(list => {
      this.rides = list;
      console.log(this.rides)
      this.applyFilters();
    });
  }

  applyFilters() {
    let tmp = this.rides.slice();
    if (this.vehicleTypeFilter) {
      tmp = tmp.filter(r => r.vehicleType === this.vehicleTypeFilter);
    }

    tmp = tmp.filter(r => {
      const now = new Date();
      const rt = new Date(r.timeISO);
      if (rt.toDateString() !== now.toDateString()) return false;
      const diffMins = Math.abs((rt.getTime() - now.getTime()) / 60000);
      return diffMins <= 60;
    });

    this.filtered = tmp;
  }

  onFilterChange(type?: string) {
    this.vehicleTypeFilter = type;
    this.applyFilters();
  }

  goToBook(id: string) {
    this.router.navigate(['/book', id]);
  }

}
