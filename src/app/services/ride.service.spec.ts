import { TestBed } from '@angular/core/testing';
import { RideService } from './ride.service';

describe('RideService', () => {
  let service: RideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideService);
    service._clearAllForTest();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a ride for current day', () => {
    const now = new Date();
    const payload = {
      ownerEmployeeId: 'A1',
      vehicleType: 'Bike' as const,
      vehicleNo: 'B001',
      vacantSeats: 1,
      timeISO: now.toISOString(),
      pickupPoint: 'P1',
      destination: 'D1'
    };
    const r = service.addRide(payload);
    expect(r.id).toBeTruthy();
    expect(service.getAll().length).toBe(1);
  });

  it('should reject ride for other day', () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60000);
    const payload = {
      ownerEmployeeId: 'A1',
      vehicleType: 'Bike' as const,
      vehicleNo: 'B001',
      vacantSeats: 1,
      timeISO: tomorrow.toISOString(),
      pickupPoint: 'P1',
      destination: 'D1'
    };
    expect(() => service.addRide(payload)).toThrowError('Ride time must be for the current day');
  });

  it('should book a ride and decrement seats and prevent double booking and owner booking', () => {
    const now = new Date();
    const r = service.addRide({
      ownerEmployeeId: 'OWNER',
      vehicleType: 'Car' as const,
      vehicleNo: 'C1',
      vacantSeats: 2,
      timeISO: now.toISOString(),
      pickupPoint: 'X',
      destination: 'Y'
    });

    const res1 = service.bookRide(r.id, 'EMP1');
    expect(res1.success).toBeTrue();

    let updated = service.findById(r.id)!;
    expect(updated.vacantSeats).toBe(1);
    expect(updated.bookedBy).toContain('EMP1');

    const res2 = service.bookRide(r.id, 'EMP1');
    expect(res2.success).toBeFalse();
    expect(res2.message).toContain('Already booked');

    const res3 = service.bookRide(r.id, 'OWNER');
    expect(res3.success).toBeFalse();
    expect(res3.message).toContain('Cannot book your own ride');
  });

  it('should not allow booking when vacant seats are zero', () => {
    const now = new Date();
    const r = service.addRide({
      ownerEmployeeId: 'O2',
      vehicleType: 'Bike' as const,
      vehicleNo: 'B2',
      vacantSeats: 1,
      timeISO: now.toISOString(),
      pickupPoint: 'X',
      destination: 'Y'
    });
    const v1 = service.bookRide(r.id, 'E1');
    expect(v1.success).toBeTrue();
    const v2 = service.bookRide(r.id, 'E2');
    expect(v2.success).toBeFalse();
    expect(v2.message).toContain('No vacant seats');
  });

  it('should filter by time with +/- buffer', () => {
    service._clearAllForTest();
    const now = new Date();
    service.addRide({
      ownerEmployeeId: 'a',
      vehicleType: 'Car' as const,
      vehicleNo: 'v1',
      vacantSeats: 2,
      timeISO: new Date(now.getTime() + 30 * 60000).toISOString(),
      pickupPoint: 'p',
      destination: 'd'
    });
    const matched = service.filterByTime(now, 60);
    expect(matched.length).toBe(1);
  });
});
