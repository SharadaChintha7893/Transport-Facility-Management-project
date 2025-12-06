import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RideService } from '../../services/ride.service';

@Component({
  selector: 'app-add-ride',
  templateUrl: './add-ride.component.html',
  styleUrls: ['./add-ride.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class AddRideComponent {
  form: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private rideService: RideService, private router: Router) {
    this.form = this.fb.group({
      ownerEmployeeId: ['', Validators.required],
      vehicleType: ['Car', Validators.required],
      vehicleNo: ['', Validators.required],
      vacantSeats: [1, [Validators.required, Validators.min(1)]],
      timeISO: ['', Validators.required],
      pickupPoint: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }

  setTodayTimeFromInput(timeStr: string) {
    const [hh, mm] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    return d.toISOString();
  }

  submit() {
    this.error = '';
    if (this.form.invalid) {
      this.error = 'Please fill all required fields correctly.';
      return;
    }
    try {
      const payload = {
        ownerEmployeeId: this.form.value.ownerEmployeeId,
        vehicleType: this.form.value.vehicleType,
        vehicleNo: this.form.value.vehicleNo,
        vacantSeats: +this.form.value.vacantSeats,
        timeISO: this.setTodayTimeFromInput(this.form.value.timeISO),
        pickupPoint: this.form.value.pickupPoint,
        destination: this.form.value.destination
      };
      this.rideService.addRide(payload);
      this.router.navigateByUrl('riderList');
    } catch (e: any) {
      this.error = e.message || 'Failed to add ride';
    }
  }
}
