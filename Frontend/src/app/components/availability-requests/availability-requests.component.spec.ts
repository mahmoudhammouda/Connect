import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvailabilityRequestsComponent } from './availability-requests.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RecruiterRequest } from '../../models/recruiter-request.model';

describe('AvailabilityRequestsComponent', () => {
  let component: AvailabilityRequestsComponent;
  let fixture: ComponentFixture<AvailabilityRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailabilityRequestsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AvailabilityRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display requests when they exist', () => {
    // Arrange
    const mockRequests: RecruiterRequest[] = [
      {
        id: '1',
        description: 'Looking for Angular developers',
        requiredExpertise: ['Angular', 'TypeScript', 'RxJS'],
        postedDate: new Date('2025-03-10')
      },
      {
        id: '2',
        description: 'Need DevOps expertise',
        requiredExpertise: ['Kubernetes', 'Docker', 'CI/CD'],
        postedDate: new Date('2025-03-12')
      }
    ];
    
    // Act
    component.requests = mockRequests;
    fixture.detectChanges();
    
    // Assert
    const requestElements = fixture.nativeElement.querySelectorAll('.border.p-4');
    expect(requestElements.length).toBe(2);
    
    // Check content of first request
    expect(requestElements[0].textContent).toContain('Looking for Angular developers');
    expect(requestElements[0].textContent).toContain('Angular');
    expect(requestElements[0].textContent).toContain('TypeScript');
  });
});
