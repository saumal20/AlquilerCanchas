import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartidosAbiertosPage } from './partidos-abiertos.page';

describe('PartidosAbiertosPage', () => {
  let component: PartidosAbiertosPage;
  let fixture: ComponentFixture<PartidosAbiertosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PartidosAbiertosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
