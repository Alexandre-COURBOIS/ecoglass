import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserContactInformationsComponent } from './update-user-contact-informations.component';

describe('UpdateUserContactInformationsComponent', () => {
  let component: UpdateUserContactInformationsComponent;
  let fixture: ComponentFixture<UpdateUserContactInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserContactInformationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserContactInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
