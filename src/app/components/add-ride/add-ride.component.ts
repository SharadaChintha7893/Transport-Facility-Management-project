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

  private vehicleNoPattern = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{3,4}$/i;

  constructor(private fb: FormBuilder, private rideService: RideService, private router: Router) {
    this.form = this.fb.group({
      ownerEmployeeId: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      vehicleType: ['Car', Validators.required],
      vehicleNo: ['', [Validators.required, Validators.pattern(this.vehicleNoPattern)]],
      vacantSeats: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      timeISO: ['', [Validators.required]],
      pickupPoint: ['', [Validators.required, Validators.minLength(2)]],
      destination: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  get f() { return this.form.controls; }


  private setTodayTimeFromInput(timeStr: string) {
    const [hhStr, mmStr] = (timeStr || '').split(':');
    const hh = Number(hhStr ?? 0);
    const mm = Number(mmStr ?? 0);
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    return d.toISOString();
  }

  submit() {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Please correct the highlighted fields.';
      return;
    }

    try {
      const payload = {
        id: this.form.value.ownerEmployeeId,
        ownerEmployeeId: this.form.value.ownerEmployeeId,
        vehicleType: this.form.value.vehicleType,
        vehicleNo: this.form.value.vehicleNo.toUpperCase(),
        vacantSeats: Number(this.form.value.vacantSeats),
        timeISO: this.setTodayTimeFromInput(this.form.value.timeISO),
        pickupPoint: this.form.value.pickupPoint,
        destination: this.form.value.destination,
        bookings: []
      };


      this.rideService.addRide(payload);


      this.form.reset({
        vehicleType: 'Car',
        vacantSeats: 1
      });
      this.router.navigateByUrl('riderList');
    } catch (e: any) {
      this.error = e?.message || 'Failed to add ride';
    }
  }
}
