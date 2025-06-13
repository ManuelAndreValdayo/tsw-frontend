import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../user.service';


@Component({
  selector: 'app-register1',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Añade CommonModule, FormsModule y ReactiveFormsModule
  templateUrl: './register1.component.html',
  styleUrl: './register1.component.css'
})
export class Register1Component {
  respuestaOK: boolean
  contraseniasNoCoinciden: boolean
  errorEnRegistro: boolean
  registerForm: FormGroup
  
  passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const p1 = group.get('pwd1')?.value;
    const p2 = group.get('pwd2')?.value;
    return p1 && p2 && p1 !== p2
      ? { passwordMismatch: true }
      : null;
  };

  constructor(private formBuild: FormBuilder,private service : UserService, private router:Router) { 
    this.respuestaOK = false;
    this.contraseniasNoCoinciden = false;
    this.errorEnRegistro = false;
    this.registerForm = this.formBuild.group(
      {
        email: ['', [Validators.required, Validators.email]],
        pwd1: ['', [Validators.required, Validators.minLength(8), createPasswordStrengthValidator()]],
        pwd2: ['',[Validators.required]],
        nombre: ['',[Validators.required]],
        apellidos: ['',[Validators.required]],
        telefono: ['', [Validators.pattern(/^[0-9]{9}$/)]]
      },
      {validators: this.passwordMatchValidator}
    );
  }

  validarFormulario() {
    this.registerForm.markAllAsTouched(); // Marca todos los campos como 'touched'
  
    // Recorre controles inválidos y fuerza reflow para reiniciar la animación
  Object.keys(this.registerForm.controls).forEach(name => {
    const el = document.querySelector<HTMLInputElement>(`[formControlName="${name}"]`);
    if (el && el.classList.contains('is-invalid')) {
      el.classList.remove('invalid-pulse');
      void el.offsetWidth;    // fuerza reflow
      el.classList.add('invalid-pulse');
    }
  });
  
    if (this.registerForm.valid) {
      console.log('Formulario válido');
      this.registrar(); // Llama al método de registrar si el formulario es válido
    }
  }
  registrar() {
    this.respuestaOK = false;
    this.contraseniasNoCoinciden = false;
    this.errorEnRegistro = false;
  
    // Validar que las contraseñas coincidan
    if (this.registerForm.controls['pwd1'].value !== this.registerForm.controls['pwd2'].value) {
      this.contraseniasNoCoinciden = true;
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    } 
  
    // Realizar el registro
    this.service.register1(
      this.registerForm.controls['email'].value,
      this.registerForm.controls['pwd1'].value,
      this.registerForm.controls['pwd2'].value,
      this.registerForm.controls['nombre'].value,
      this.registerForm.controls['apellidos'].value,
      this.registerForm.controls['telefono'].value
    ).subscribe(
      ok => {
        console.log('Registro exitoso', ok);
        this.respuestaOK = true;
  
        // Mensaje de confirmación
        Swal.fire({
          title: 'Registro exitoso',
          text: '¡Tu registro se ha completado correctamente!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/Login']);
          }
        });
      },
      error => {
        console.error('Error en el registro', error);
        this.errorEnRegistro = true;
  
        // Mensaje de error
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al registrar. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }
}
export  function createPasswordStrengthValidator(): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {
      const value = control.value;
      if (!value) {
          return null;
      }
      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;
            return !passwordValid ? {passwordStrength:true}: null;
      /**tambien se podría devolver un objeto de este tipo
       * {
          passwordStrength: {
          hasUpperCase: true,
          hasLowerCase: true,
          hasNumeric: false
          }
        }
       */
  }
}
