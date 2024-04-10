import { Component, Input, OnInit } from '@angular/core';
import { Gif } from '../../interfaces/gifs.interfaces';

@Component({
  selector: 'gifs-card',
  templateUrl: './card.component.html',
})

// Hacemos uso del ciclo de vida OnInit, se ejecuta cuando el componente se ha inicializado
export class CardComponent implements OnInit {
  ngOnInit(): void {
    if (!this.gif) throw new Error('Gif property is required');
  }

  @Input()
  public gif!: Gif;
}
