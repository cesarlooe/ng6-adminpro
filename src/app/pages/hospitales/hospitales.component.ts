import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Hospital } from '../../models/hospital.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = true;

  constructor(private _hospitalService: HospitalService, private _modalUploadService: ModalUploadService) {
  }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion.subscribe(() => {
      this.cargarHospitales();
    });
  }

  cambiarDesde(valor) {
    const desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();
  }

  cargarHospitales() {
    this._hospitalService.cargarHospitales(this.desde)
      .subscribe((resp: any) => {
        this.hospitales = resp.hospitales;
        this.totalRegistros = resp.total;
        this.cargando = false;
      });
  }

  buscarHospital(termino: string) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }
    this.cargando = true;
    this._hospitalService.buscarHospital(termino)
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
        this.cargando = false;
      });
  }

  crearHospital() {
    swal({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.value) {
        this.cargando = true;
        this._hospitalService.crearHospital(result.value)
          .subscribe(() => {
            this.cargarHospitales();
          });
      } else {
        swal('Error', 'Debe ingresar un nombre para el hospital', 'error');
      }
    });
  }

  cargarUpload(id: string) {
    this._modalUploadService.cargarValores('hospitales', id);
  }

  guardarHospital(hospital: Hospital) {
    this.cargando = true;
    this._hospitalService.actualizarHospital(hospital)
      .subscribe(() => this.cargarHospitales());
  }

  borrarHospital(hospital: Hospital) {
    swal({
      title: '¿Está seguro?',
      text: `Está a punto de borrar al hospital: ${hospital.nombre}`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#d33',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        this._hospitalService.borrarHospital(hospital._id)
          .subscribe((borrado: boolean) => {
            this.cargarHospitales();
          });
      }
    });
  }
}
