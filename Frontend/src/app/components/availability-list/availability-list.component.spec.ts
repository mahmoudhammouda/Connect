import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AvailabilityListComponent } from './availability-list.component';
import { AvailabilityFormComponent } from '../availability-form/availability-form.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AvailabilityListComponent', () => {
  let component: AvailabilityListComponent;
  let fixture: ComponentFixture<AvailabilityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AvailabilityListComponent,
        AvailabilityFormComponent,
        LoginModalComponent
      ],
      imports: [FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AvailabilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter availabilities based on search query', () => {
    // Set up test data
    component.searchQuery = 'React';
    component.filterAvailabilities();
    
    // Check that only availabilities with React in role or expertise are included
    const filteredResults = component.filteredAvailabilities;
    expect(filteredResults.every(availability => 
      availability.role.toLowerCase().includes('react') || 
      availability.expertise.some(skill => skill.toLowerCase().includes('react'))
    )).toBeTruthy();
  });

  it('should toggle details when clicking on a row', () => {
    const availabilityId = component.availabilities[0].id;
    
    // Initially expanded id should be null
    expect(component.expandedId).toBeNull();
    
    // Simulate row click
    const mockEvent = new MouseEvent('click');
    component.handleRowClick(mockEvent, availabilityId);
    
    // Now expanded id should be the clicked availability id
    expect(component.expandedId).toBe(availabilityId);
    
    // Click the same row again
    component.handleRowClick(mockEvent, availabilityId);
    
    // Expanded id should be null again
    expect(component.expandedId).toBeNull();
  });

  it('should open the availability form with the selected availability', () => {
    const availability = component.availabilities[0];
    
    // Initially form should be closed and no availability selected
    expect(component.showAvailabilityForm).toBeFalse();
    expect(component.selectedAvailability).toBeNull();
    
    // Open form with the availability
    component.openAvailabilityForm(availability);
    
    // Form should be open and availability should be selected
    expect(component.showAvailabilityForm).toBeTrue();
    expect(component.selectedAvailability).toBe(availability);
  });
});
