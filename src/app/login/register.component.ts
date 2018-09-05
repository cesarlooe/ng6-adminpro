import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';


import Swal from 'sweetalert2';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(private _usuarioService: UsuarioService, private router: Router) { }

  sonIguales(campo1: string, campo2: string): ValidatorFn {
    return (group: FormGroup): {[key: string]: boolean} | null => {
      const valor1 = group.controls[campo1].value;
      const valor2 = group.controls[campo2].value;

      if (valor1 === valor2) {
        return null;
      }
      return { sonIguales: true };
    };
  }

  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false),
    }, { validators: this.sonIguales('password', 'password2') });

    this.forma.setValue({
      nombre: 'Test',
      correo: 'test@test.com',
      password: '123456',
      password2: '123456',
      condiciones: true,
    });
  }

  registrarUsuario() {

    if (this.forma.invalid) {
      return;
    }

    if (!this.forma.value.condiciones) {
      Swal('Importante', 'Debe aceptar las condiciones', 'warning');
      return;
    }

    const usuario: Usuario = {
      nombre: this.forma.value.nombre,
      email: this.forma.value.correo,
      password: this.forma.value.password,
    };

    this._usuarioService.crearUsuario(usuario)
      .subscribe(respuesta => console.log(respuesta));
      // .subscribe(response => this.router.navigate(['/login']));
  }
}
