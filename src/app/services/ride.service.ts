import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ride, VehicleType } from '../models/ride.model';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

@Injectable({ providedIn: 'root' })
export class RideService {
  private _rides$ = new BehaviorSubject<Ride[]>([]);
  rides$ = this._rides$.asObservable();

  public readonly bufferMins = 60;

  constructor() {
    const now = new Date();

    const addMinutes = (date: Date, mins: number) => new Date(date.getTime() + mins * 60000);

    this._rides$.next([
      {
        id: uid(),
        ownerEmployeeId: 'EMP100',
        vehicleType: 'Car',
        vehicleNo: 'KA01AB1234',
        vacantSeats: 3,
        timeISO: addMinutes(now, 20).toISOString(),
        pickupPoint: 'Office Gate',
        destination: 'Hosur Rd',
        bookedBy: []
      },
      {
        id: uid(),
        ownerEmployeeId: 'EMP101',
        vehicleType: 'Bike',
        vehicleNo: 'KA02BC5678',
        vacantSeats: 1,
        timeISO: addMinutes(now, 40).toISOString(),
        pickupPoint: 'Main Street',
        destination: 'Electronic City',
        bookedBy: []
      },
      {
        id: uid(),
        ownerEmployeeId: 'EMP102',
        vehicleType: 'Car',
        vehicleNo: 'KA03CD9012',
        vacantSeats: 2,
        timeISO: addMinutes(now, 60).toISOString(),
        pickupPoint: 'Metro Station',
        destination: 'Whitefield',
        bookedBy: []
      },
      {
        id: uid(),
        ownerEmployeeId: 'EMP103',
        vehicleType: 'Bike',
        vehicleNo: 'KA04DE3456',
        vacantSeats: 1,
        timeISO: addMinutes(now, 15).toISOString(),
        pickupPoint: 'City Park',
        destination: 'ITPL',
        bookedBy: []
      },
      {
        id: uid(),
        ownerEmployeeId: 'EMP104',
        vehicleType: 'Car',
        vehicleNo: 'KA05EF7890',
        vacantSeats: 4,
        timeISO: addMinutes(now, 90).toISOString(),
        pickupPoint: 'Railway Station',
        destination: 'Koramangala',
        bookedBy: []
      }
    ]);
  }

  getAll(): Ride[] {
    return this._rides$.getValue().slice();
  }

  addRide(payload: Omit<Ride, 'id' | 'bookedBy'>): Ride {
    const now = new Date();
    const t = new Date(payload.timeISO);
    if (t.toDateString() !== now.toDateString()) {
      throw new Error('Ride time must be for the current day');
    }
    const newRide: Ride = { ...payload, id: uid(), bookedBy: [] };
    this._rides$.next([newRide, ...this.getAll()]);

    return newRide;
  }

  findById(id: string): Ride | undefined {
    return this.getAll().find(r => r.id === id);
  }

  bookRide(rideId: string, employeeId: string): { success: boolean; message?: string } {
    const rides = this.getAll();
    const idx = rides.findIndex(r => r.id === rideId);
    if (idx === -1) return { success: false, message: 'Ride not found' };
    const ride = { ...rides[idx] };

    if (ride.ownerEmployeeId === employeeId) {
      return { success: false, message: 'Cannot book your own ride' };
    }

    if (ride.bookedBy.includes(employeeId)) {
      return { success: false, message: 'Already booked this ride' };
    }

    if (ride.vacantSeats <= 0) {
      return { success: false, message: 'No vacant seats' };
    }

    ride.vacantSeats -= 1;
    ride.bookedBy = [...ride.bookedBy, employeeId];

    rides[idx] = ride;
    this._rides$.next(rides);
    return { success: true };
  }

  filterByVehicleType(type?: VehicleType) {
    return this.getAll().filter(r => (type ? r.vehicleType === type : true));
  }

  filterByTime(target: Date, bufferMins = this.bufferMins) {
    const start = new Date(target.getTime() - bufferMins * 60000);
    const end = new Date(target.getTime() + bufferMins * 60000);
    return this.getAll().filter(r => {
      const rt = new Date(r.timeISO);
      if (rt.toDateString() !== target.toDateString()) return false;
      return rt >= start && rt <= end;
    });
  }

  _clearAllForTest() {
    this._rides$.next([]);
  }
}
