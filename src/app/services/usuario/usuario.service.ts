import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) {
    console.log('Servicio de usuario listo');
  }

  crearUsuario(usuario: Usuario) {
    const url = `${URL_SERVICIOS}/usuario`;
    return this.http.post(url, usuario)
      .pipe(
        map((respuesta: any) => {
          swal('Usuario creado', usuario.email, 'success');
          return respuesta.usuario;
        })
      );
  }

  login(usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    const url = `${URL_SERVICIOS}/login`;
    return this.http.post(url, usuario)
      .pipe(
        map((respuesta: any) => {
          localStorage.setItem('id', respuesta.id);
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
          return true;
        })
      );
  }
}
