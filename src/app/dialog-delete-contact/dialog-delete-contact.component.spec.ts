import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteContactComponent } from './dialog-delete-contact.component';

describe('DialogDeleteContactComponent', () => {
  let component: DialogDeleteContactComponent;
  let fixture: ComponentFixture<DialogDeleteContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDeleteContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
