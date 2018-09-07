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

  usuario: Usuario;
  token: string;

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

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  loginGoogle(token: string) {
    const url = `${URL_SERVICIOS}/login/google`;
    return this.http.post(url, { token })
      .pipe(
        map((resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario);
          console.log(resp);
          return true;
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
        map((resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario);
          return true;
        })
      );
  }
}
