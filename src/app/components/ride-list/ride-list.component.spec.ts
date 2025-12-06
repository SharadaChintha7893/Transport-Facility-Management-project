import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RideListComponent } from './ride-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RideService } from '../../services/ride.service';

describe('RideListComponent', () => {
  let component: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;
  let service: RideService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RideListComponent,
        RouterTestingModule
      ],
      providers: [RideService]
    }).compileComponents();

    fixture = TestBed.createComponent(RideListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(RideService);

    if (service['_clearAllForTest']) {
      service['_clearAllForTest']();
    }

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows no rides when service empty', () => {
    component.applyFilters();
    expect(component.filtered.length).toBe(0);
  });

  it('filters by vehicle type', () => {
    const now = new Date();

    service.addRide({
      ownerEmployeeId: 'A',
      vehicleType: 'Car',
      vehicleNo: 'V1',
      vacantSeats: 1,
      timeISO: now.toISOString(),
      pickupPoint: 'P',
      destination: 'D'
    });

    service.addRide({
      ownerEmployeeId: 'B',
      vehicleType: 'Bike',
      vehicleNo: 'V2',
      vacantSeats: 1,
      timeISO: now.toISOString(),
      pickupPoint: 'P2',
      destination: 'D2'
    });

    component.ngOnInit();
    component.onFilterChange('Car');

    expect(component.filtered.length).toBe(1);
    expect(component.filtered[0].vehicleType).toBe('Car');
  });
});
