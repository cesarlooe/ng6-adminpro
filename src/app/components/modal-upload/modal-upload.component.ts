import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SubirArchivoService } from '../../services/service.index';
import { ModalUploadService } from './modal-upload.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {
  imagenSubir: File;
  imagenTemp: string;

  @ViewChild('closeModalButton') closeModalButton: ElementRef;

  constructor(public _subirArchivoService: SubirArchivoService, public _modalUploadService: ModalUploadService) {
  }

  ngOnInit() {
  }

  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (!archivo.type.includes('image')) {
      swal('Solo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result.toString();
  }

  subirImagen() {
    this._subirArchivoService.subirArchivo(this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id)
      .subscribe(
        (resp) => {
          this._modalUploadService.notificacion.emit(resp);
          const element = this.closeModalButton.nativeElement;
          element.click();
        },
        (error) => {
          console.log('Error en la carga...');
        }
      );
  }

  borrarValores() {
    this._modalUploadService.borrarValores();
  }
}
