import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import { map } from 'rxjs/operators';
import { Hospital } from '../../models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  headers: HttpHeaders = new HttpHeaders;

  constructor(private http: HttpClient, private _usuarioService: UsuarioService) {
    const token = this._usuarioService.token;
    this.headers = this.headers.append('Authorization', `Bearer ${token}`);
  }

  cargarHospitales(desde: number) {
    const url = `${URL_SERVICIOS}/hospital?desde=${desde}`;
    return this.http.get(url);
  }

  obtenerHospital(id: string) {
    const url = `${URL_SERVICIOS}/hospital/${id}`;
    return this.http.get(url);
  }

  borrarHospital(id: string) {
    const url = `${URL_SERVICIOS}/hospital/${id}`;
    return this.http.delete(url, { headers: this.headers });
  }

  crearHospital(nombre: string) {
    const url = `${URL_SERVICIOS}/hospital/`;
    return this.http.post(url, { nombre }, { headers: this.headers });
  }

  buscarHospital(termino: string) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/hospitales/${termino}`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.hospitales)
      );
  }

  actualizarHospital(hospital: Hospital) {
    const url = `${URL_SERVICIOS}/hospital/${hospital._id}`;
    return this.http.put(url, hospital, { headers: this.headers });
  }

}
