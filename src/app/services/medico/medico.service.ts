import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  headers: HttpHeaders = new HttpHeaders;

  constructor(private http: HttpClient, private _usuarioService: UsuarioService) {
    const token = this._usuarioService.token;
    this.headers = this.headers.append('Authorization', `Bearer ${token}`);
  }

  cargarMedicos(desde: number) {
    const url = `${URL_SERVICIOS}/medico?desde=${desde}`;
    return this.http.get(url);
  }

  buscarMedicos(termino: string) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/medicos/${termino}`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.medicos)
      );
  }

  borrarMedico(id: string) {
    const url = `${URL_SERVICIOS}/medico/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .pipe(
        map(() => {
          swal('Médico borrado', 'El médico ha sido eliminado correctamente', 'success');
          return true;
        })
      );
  }

  guardarMedico(medico: Medico) {
    const url = `${URL_SERVICIOS}/medico`;
    return this.http.post(url, medico, { headers: this.headers })
      .pipe(
        map((resp: any) => {
          swal('Médico creado', medico.nombre, 'success');
          return resp.medico;
        })
      );
  }

  cargarMedico(id: string) {
    const url = `${URL_SERVICIOS}/medico/${id}`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.medico)
      );
  }
}
