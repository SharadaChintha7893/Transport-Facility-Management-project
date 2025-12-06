import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddRideComponent } from './add-ride.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RideService } from '../../services/ride.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AddRideComponent', () => {
  let component: AddRideComponent;
  let fixture: ComponentFixture<AddRideComponent>;
  let rideService: RideService;

  const routerSpy = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddRideComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        RideService,
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRideComponent);
    component = fixture.componentInstance;
    rideService = TestBed.inject(RideService);

    if (rideService['_clearAllForTest']) {
      rideService['_clearAllForTest']();
    }

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    component.form.reset();
    expect(component.form.valid).toBeFalse();
  });

  it('should add ride and navigate to riderList', () => {
    component.form.setValue({
      ownerEmployeeId: 'EMP1',
      vehicleType: 'Car',
      vehicleNo: 'V1',
      vacantSeats: 2,
      timeISO: '12:00',
      pickupPoint: 'P',
      destination: 'D'
    });

    component.submit();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('riderList');
    expect(rideService.getAll().length).toBe(1);
  });
});
