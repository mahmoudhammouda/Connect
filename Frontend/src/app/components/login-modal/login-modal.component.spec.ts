import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginModalComponent } from './login-modal.component';

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginModalComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeModal when close is called', () => {
    spyOn(component.closeModal, 'emit');
    component.close();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should emit login and close when loginWithLinkedIn is called', () => {
    spyOn(component.login, 'emit');
    spyOn(component.closeModal, 'emit');
    component.loginWithLinkedIn();
    expect(component.login.emit).toHaveBeenCalled();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });
});
