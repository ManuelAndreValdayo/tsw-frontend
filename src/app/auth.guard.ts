import { CanActivateFn, NavigationEnd, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './user.service';
import { AppConstants } from './constantes';
import * as CryptoJS from 'crypto-js';

export const authGuard: CanActivateFn = (route, state) => {
  // const userService = inject(UserService); // Inyecta el servicio de usuario
  // const router = inject(Router); // Inyecta el router

  //     router.events.subscribe(event => {
  //     if (event instanceof NavigationEnd) {
  //       userService.checkCookie().subscribe({
  //         next: (response) => {
  //           if(event.urlAfterRedirects.startsWith('/listaCompartida')){
  //             AppConstants.URL = event.urlAfterRedirects;
  //             const encrypted = AppConstants.URL.split('/');
  //             console.log(decryptNumber(encrypted[2]));
              
  //           }
  //           console.log("auth");
  //           if((event.urlAfterRedirects != '/Register') && response == ''){
  //             router.navigate(['/Login']);
  //             return false;
  //           }
  //           return true;
  //         },
  //         error: (error) => {
  //           console.error('Error al obtener el string:', error);
  //         },
  //       });
  //     }
  //   });
  //   function decryptNumber(encryptedData: string): number {
  //     const hash = decodeURIComponent(encryptedData);
  //     const bytes = CryptoJS.AES.decrypt(hash, 'miClaveSecreta123');
  //     const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  //     return parseInt(decrypted, 10); // Convertir el string desencriptado a número
  //   }
  return true;
};
