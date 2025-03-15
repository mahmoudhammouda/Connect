import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyAvailabilityListComponent } from './my-availability-list.component';
import { FormsModule } from '@angular/forms';

describe('MyAvailabilityListComponent', () => {
  let component: MyAvailabilityListComponent;
  let fixture: ComponentFixture<MyAvailabilityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAvailabilityListComponent, FormsModule]
    }).compileComponents();
    
    fixture = TestBed.createComponent(MyAvailabilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply filters correctly', () => {
    component.statusFilter = 'immediate';
    component.applyFilters();
    expect(component.filteredAvailabilities.every(item => item.status === 'immediate')).toBe(true);
  });

  it('should get correct status text', () => {
    expect(component.getStatusText('immediate')).toBe('Available Now');
    expect(component.getStatusText('soon')).toBe('Available Soon');
    expect(component.getStatusText('inactive')).toBe('Not Available');
  });

  it('should get correct status dot class', () => {
    expect(component.getStatusDotClass('immediate')).toContain('bg-green-500');
    expect(component.getStatusDotClass('soon')).toContain('bg-yellow-500');
    expect(component.getStatusDotClass('inactive')).toContain('bg-gray-400');
  });
});
