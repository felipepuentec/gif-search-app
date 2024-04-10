import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

// Con el provided in root hacemos que este servicio este disponible a lo largo de toda la aplicacion que inyecten este servicio
// Sin eso deberiamos proveer el servicio en los providers de los modulos, e importarlos si hay la necesidad
@Injectable({ providedIn: 'root' })
export class GifsService {
  public gifList: Gif[] = [];
  private _tagsHistory: string[] = [];
  private apiKey: string = '2oSSWrBSFvfEZ1ncFINmZofMIqlTh5nM';
  private serviceUrl: string = 'http://api.giphy.com/v1/gifs';

  // inyectamos el servicio
  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    // Este arreglo pasaria por referencia, por lo que usamos ... para crear una copia del valor de los tags historys
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('History', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('History')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('History')!);

    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  // async searchTag(tag: string): Promise<void> {
  //   if (tag.length === 0) return;
  //   this.organizeHistory(tag);

  //   // Es lo que hacemos normalmente con JS
  //   // const resp = await fetch(
  //   //   'http://api.giphy.com/v1/gifs/search?api_key=2oSSWrBSFvfEZ1ncFINmZofMIqlTh5nM&q=the office&limit=10'
  //   // );
  //   // const data = await resp.json();

  //   // O ...

  //   // fetch(
  //   //   'http://api.giphy.com/v1/gifs/search?api_key=2oSSWrBSFvfEZ1ncFINmZofMIqlTh5nM&q=the office&limit=10'
  //   // )
  //   //   .then((resp) => resp.json())
  //   //   .then((data) => console.log(data));
  // }
  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);

    // Esto no es una promesa, es un OBSERVABLE
    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((resp) => {
        this.gifList = resp.data;
      });
  }
}
