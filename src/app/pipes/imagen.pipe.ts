import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import swal from 'sweetalert2';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any {
    let url = `${URL_SERVICIOS}/img/`;
    if (!img) {
      return `${url}/usuarios/xxx`;
    }
    if (img.includes('https')) {
      return img;
    }
    switch (tipo) {
      case 'usuario':
        url = `${url}/usuarios/${img}`;
        break;
      case 'medico':
        url = `${url}/usuarios/${img}`;
        break;
      case 'hospital':
        url = `${url}/usuarios/${img}`;
        break;
      default:
        break;
    }
    return url;
  }

}
