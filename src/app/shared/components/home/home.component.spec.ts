import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { WeatherService } from '../../services/weather.service';
import { ShareDataService } from '../../services/share-data.service';

// Mock clases should be on a different file
class mockWeatherService {
  getForecastByCity(city: string) {
    return { weather: [ { main: 'Rain' } ] };
  }
}

describe('HomeComponent', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let shareDataService: ShareDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [
        { provide: WeatherService, useValue: mockWeatherService },
        ShareDataService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    shareDataService = new ShareDataService();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Click openModal button shuld call method open()', () => {
    spyOn(component, 'open');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.open).toHaveBeenCalled();
    });
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('Description field validity when empty should be false', () => {
    const description = component.form.controls['description'];
    expect(description.valid).toBeFalsy();
  });

  it('Description field validity when filled should be truth', () => {
    const description = component.form.controls['description'];
    description.setValue('Hello description');
    expect(description.valid).toBeTruthy();
  });

  it('Form should be valid after all data is set', () => {
    expect(component.form.valid).toBeFalsy();
    component.form.controls['description'].setValue('This is a description');
    component.form.controls['day'].setValue(new Date());
    component.form.controls['startTime'].setValue('00:00');
    component.form.controls['endTime'].setValue('12:30');
    component.form.controls['city'].setValue('Medellin');
    expect(component.form.valid).toBeTruthy();
  });


});
