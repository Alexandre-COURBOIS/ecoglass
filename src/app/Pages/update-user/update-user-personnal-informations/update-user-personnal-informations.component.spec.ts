import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserPersonnalInformationsComponent } from './update-user-personnal-informations.component';

describe('UpdateUserPersonnalInformationsComponent', () => {
  let component: UpdateUserPersonnalInformationsComponent;
  let fixture: ComponentFixture<UpdateUserPersonnalInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserPersonnalInformationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserPersonnalInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
