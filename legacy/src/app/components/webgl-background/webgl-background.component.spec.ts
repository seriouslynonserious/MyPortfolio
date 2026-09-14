import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebglBackgroundComponent } from './webgl-background.component';

describe('WebglBackgroundComponent', () => {
  let component: WebglBackgroundComponent;
  let fixture: ComponentFixture<WebglBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebglBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebglBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
