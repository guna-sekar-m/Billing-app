import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsComponent } from './items.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ItemsComponent', () => {
  let component: ItemsComponent;
  let fixture: ComponentFixture<ItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsComponent],
      imports: [ HttpClientTestingModule ],
    });
    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
