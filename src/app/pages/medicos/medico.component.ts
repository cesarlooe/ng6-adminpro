import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = { nombre: '', hospital: '' };
  hospital: Hospital = { nombre: '', img: '' };

  constructor(
    private _hospitalService: HospitalService,
    private _medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _modalUploadService: ModalUploadService,
    ) {
      this.activatedRoute.params.subscribe((params) => {
        const id = params['id'];
        if (id !== 'nuevo') {
          this.cargarMedico(id);
        }
      });
    }

  ngOnInit() {
    this._hospitalService.cargarHospitales()
      .subscribe((resp: any) => {
        this.hospitales = resp.hospitales;
      });

    this._modalUploadService.notificacion
      .subscribe((resp) => {
        this.medico.img = resp.medico.img;
      });
  }

  guardarMedico(f: NgForm) {
    if (f.invalid) {
      return;
    }

    if (!this.medico._id) {
      this._medicoService.guardarMedico(this.medico)
        .subscribe((medico) => {
          this.medico._id = medico._id;
          this.router.navigate(['/medico', medico._id]);
        });
    } else {
      this._medicoService.actualizarMedico(this.medico)
        .subscribe();
    }
  }

  cambioHospital(id: string) {
    this._hospitalService.obtenerHospital(id)
      .subscribe((resp: any) => this.hospital = resp.hospital);
  }

  cargarMedico(id: string) {
    this._medicoService.cargarMedico(id)
      .subscribe((medico) => {
        this.medico = medico;
        this.medico.hospital = medico.hospital._id;
        this.cambioHospital(this.medico.hospital);
      });
  }

  cambiarFoto() {
    this._modalUploadService.cargarValores('medicos', this.medico._id);
  }

}
