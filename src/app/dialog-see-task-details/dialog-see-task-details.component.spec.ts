import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSeeTaskDetailsComponent } from './dialog-see-task-details.component';

describe('DialogSeeTaskDetailsComponent', () => {
  let component: DialogSeeTaskDetailsComponent;
  let fixture: ComponentFixture<DialogSeeTaskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSeeTaskDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSeeTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
