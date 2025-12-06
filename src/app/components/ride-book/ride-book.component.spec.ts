import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RideBookComponent } from './ride-book.component';
import { RideService } from '../../services/ride.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('RideBookComponent', () => {
  let component: RideBookComponent;
  let fixture: ComponentFixture<RideBookComponent>;
  let service: RideService;
  const routerSpy = { navigateByUrl: jasmine.createSpy('navigateByUrl') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RideBookComponent,
        FormsModule
      ],
      providers: [
        RideService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } }
        },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RideBookComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(RideService);


    if (service['_clearAllForTest']) service['_clearAllForTest']();


    const r = service.addRide({
      ownerEmployeeId: 'OWN',
      vehicleType: 'Car',
      vehicleNo: 'V',
      vacantSeats: 1,
      timeISO: new Date().toISOString(),
      pickupPoint: 'P',
      destination: 'D'
    });

    (TestBed.inject(ActivatedRoute) as any).snapshot.paramMap.get = () => r.id;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should book successfully and navigate', () => {
    component.employeeId = 'EMP1';
    component.book();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should show error if empty employee id', () => {
    component.employeeId = '';
    component.book();
    expect(component.message).toContain('Enter Employee ID');
  });
});
