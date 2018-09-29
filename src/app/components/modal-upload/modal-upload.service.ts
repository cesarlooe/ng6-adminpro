import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {

  public tipo: string;
  public id: string;

  public notificacion = new EventEmitter<any>();

  constructor() {

  }

  borrarValores() {
    this.tipo = null;
    this.id = null;
  }

  cargarValores(tipo: string, id: string) {
    this.tipo = tipo;
    this.id = id;
  }
}
