import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'gifs-search-box',
  template: `
    <h5>Buscar:</h5>
    <input
      #txtTagInput
      (keyup.enter)="searchTag()"
      type="text"
      class="form-control"
      placeholder="Buscar gifs..."
    />
  `,
})
export class SearchBoxComponent {
  // Nos sirve para tomar una referencia local
  @ViewChild('txtTagInput')
  public tagInput!: ElementRef<HTMLInputElement>;

  // Lo inyectamos
  constructor(private gifsService: GifsService) {}

  searchTag() {
    const newTag = this.tagInput.nativeElement.value;
    this.gifsService.searchTag(newTag);

    this.tagInput.nativeElement.value = ''; // Limpiamos la caja de texto
  }
}
