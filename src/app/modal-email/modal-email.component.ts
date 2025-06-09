import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UserService } from '../user.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-email',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './modal-email.component.html',
  styleUrl: './modal-email.component.css'
})
export class ModalEmailComponent {
  sendForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private userService : UserService,private dialogRef: MatDialogRef<ModalEmailComponent>) {    
    this.sendForm = this.formBuilder.group(
      {
        email: ['' , [Validators.required, Validators.email] ]        
      },
    );
    }
    
  onSubmit(){
      if(this.sendForm.invalid){
        Swal.fire({
          title: 'Error',
          text: 'Intorduzca un email válido',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
      else{
        //ENVIAR DATOS SERVIDOR EXTERNO para comprobar credenciales
        this.userService.sendEmail(this.sendForm.controls['email'].value
        ).subscribe({
          next: (response) =>{
            if(response == 201){
              Swal.fire({
                title: '¡Petición enviada!',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.dialogRef.close();
                }
              });
            }
          },
          error: (error) =>{
            if(error.status == 403){
          }else{
            Swal.fire({
              title: 'Error',
              text: 'Error, Email no encontrado',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
          }
        }
        );  
      }
    }
  }

