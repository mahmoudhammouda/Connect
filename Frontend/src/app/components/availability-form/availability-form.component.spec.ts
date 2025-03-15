import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvailabilityFormComponent } from './availability-form.component';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';

describe('AvailabilityFormComponent', () => {
  let component: AvailabilityFormComponent;
  let fixture: ComponentFixture<AvailabilityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityFormComponent, FormsModule, EditorModule]
    }).compileComponents();
    
    fixture = TestBed.createComponent(AvailabilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form data correctly', () => {
    expect(component.formData).toBeDefined();
    expect(component.formData.status).toBe('immediate');
  });

  it('should emit closeModal when close is called', () => {
    spyOn(component.closeModal, 'emit');
    component.close();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should emit save and close when handleSubmit is called', () => {
    spyOn(component.save, 'emit');
    spyOn(component.closeModal, 'emit');
    const event = new Event('submit');
    component.handleSubmit(event);
    expect(component.save.emit).toHaveBeenCalledWith(component.formData);
    expect(component.closeModal.emit).toHaveBeenCalled();
  });
});
