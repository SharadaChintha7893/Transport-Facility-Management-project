import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RideFilterComponent } from './ride-filter.component';
import { By } from '@angular/platform-browser';

describe('RideFilterComponent', () => {
  let component: RideFilterComponent;
  let fixture: ComponentFixture<RideFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideFilterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RideFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits filter change', () => {
    spyOn(component.filter, 'emit');

    const select = fixture.debugElement.query(By.css('select')).nativeElement;
    select.value = 'Car';
    select.dispatchEvent(new Event('change'));

    expect(component.filter.emit).toHaveBeenCalledWith('Car');
  });
});
