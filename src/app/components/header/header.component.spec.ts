import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /riderList when bookRide() is called', () => {
    spyOn(router, 'navigateByUrl');
    component.bookRide();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/riderList');
  });

  it('should navigate to /add when addRide() is called', () => {
    spyOn(router, 'navigateByUrl');
    component.addRide();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/add');
  });
});
