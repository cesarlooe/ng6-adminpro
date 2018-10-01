import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';
import swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  totalRegistros = 0;
  desde = 0;
  cargando = true;

  constructor(private _medicoService: MedicoService) { }

  ngOnInit() {
    this.cargarMedicos();
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
    this.cargarMedicos();
  }

  cargarMedicos() {
    this._medicoService.cargarMedicos(this.desde)
      .subscribe((resp: any) => {
        this.medicos = resp.medicos;
        this.totalRegistros = resp.total;
        this.cargando = false;
      });
  }

  buscarMedico(termino: string) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;
    this._medicoService.buscarMedicos(termino)
      .subscribe((medicos: Medico[]) => {
        this.medicos = medicos;
        this.cargando = false;
      });
  }

  borrarMedico(medico: Medico) {
    swal({
      title: '¿Está seguro?',
      text: `Está a punto de borrar a ${medico.nombre}`,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#d33',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        this._medicoService.borrarMedico(medico._id)
          .subscribe(() => {
            this.cargarMedicos();
          });
      }
    });
  }

}
