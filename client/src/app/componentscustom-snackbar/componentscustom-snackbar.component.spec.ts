import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentscustomSnackbarComponent } from './componentscustom-snackbar.component';

describe('ComponentscustomSnackbarComponent', () => {
  let component: ComponentscustomSnackbarComponent;
  let fixture: ComponentFixture<ComponentscustomSnackbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentscustomSnackbarComponent]
    });
    fixture = TestBed.createComponent(ComponentscustomSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
