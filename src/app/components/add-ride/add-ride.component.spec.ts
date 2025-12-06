import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddRideComponent } from './add-ride.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RideService } from '../../services/ride.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AddRideComponent', () => {
  let component: AddRideComponent;
  let fixture: ComponentFixture<AddRideComponent>;
  let rideServiceSpy: { addRide: jasmine.Spy };
  let routerSpy: { navigateByUrl: jasmine.Spy };

  beforeEach(async () => {
    rideServiceSpy = { addRide: jasmine.createSpy('addRide') };
    routerSpy = { navigateByUrl: jasmine.createSpy('navigateByUrl') };

    await TestBed.configureTestingModule({
      imports: [
        AddRideComponent,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: RideService, useValue: rideServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    component.form.reset();
    expect(component.form.valid).toBeFalse();
  });

  it('should call addRide and navigate when form is valid', () => {
    component.form.setValue({
      ownerEmployeeId: 'EMP1',
      vehicleType: 'Car',
      vehicleNo: 'KA01AB1234',
      vacantSeats: 2,
      timeISO: '12:00',
      pickupPoint: 'Office Gate',
      destination: 'Hosur Rd'
    });

    expect(component.form.valid).toBeTrue();

    component.submit();
    fixture.detectChanges();

    expect(rideServiceSpy.addRide).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('riderList');
    // check reset values
    expect(component.form.value.vehicleType).toBe('Car');
    expect(component.form.value.vacantSeats).toBe(1);
  });

  it('should not call addRide when form invalid', () => {
    component.form.setValue({
      ownerEmployeeId: '',
      vehicleType: 'Car',
      vehicleNo: '',
      vacantSeats: 0,
      timeISO: '',
      pickupPoint: '',
      destination: ''
    });

    component.submit();
    expect(rideServiceSpy.addRide).not.toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    expect(component.error).toBeTruthy();
  });
});
