import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private _subirArchivoSerive: SubirArchivoService
    ) {
    this.cargarStorage();
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
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

  actualizarUsuario(usuario: Usuario) {
    const url = `${URL_SERVICIOS}/usuario/${usuario._id}`;
    let headers: HttpHeaders = new HttpHeaders;
    headers = headers.append('Authorization', `Bearer ${this.token}`);
    return this.http.put(url, usuario, { headers })
      .pipe(
        map((resp: any) => {
          if (usuario._id === this.usuario._id) {
            const usuarioDB: Usuario = resp.usuario;
            this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
          }
          swal('Usuario actualizado', usuario.nombre, 'success');
          return true;
        })
      );
  }

  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    const url = `${URL_SERVICIOS}/login/google`;
    return this.http.post(url, { token })
      .pipe(
        map((resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario);
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

  cambiarImagen(archivo: File, id: string) {
    return this._subirArchivoSerive.subirArchivo(archivo, 'usuarios', id)
      .pipe(
        map((resp: any) => {
          const usuarioDB: Usuario = resp.usuario;
          this.usuario.img = usuarioDB.img;
          swal('Imagen actualizada');
          this.guardarStorage(id, this.token, this.usuario);
        })
      );
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${URL_SERVICIOS}/usuario?desde=${desde}`;
    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/usuarios/${termino}`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.usuarios)
      );
  }

  borrarUsuario(id: string) {
    let headers: HttpHeaders = new HttpHeaders;
    headers = headers.append('Authorization', `Bearer ${this.token}`);
    const url = `${URL_SERVICIOS}/usuario/${id}`;
    return this.http.delete(url, {headers})
      .pipe(
        map(() => {
          swal('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
          return true;
        })
      );
  }
}
