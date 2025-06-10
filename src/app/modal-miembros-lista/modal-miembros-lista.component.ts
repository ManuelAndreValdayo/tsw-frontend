import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalEliminarMiembroComponent } from '../modal-eliminar-miembro/modal-eliminar-miembro.component';
interface MiembroDeLista {
  lista_id: any; // Puedes tipar esto mejor si conoces la estructura
  id: number;
  miembro_id: number;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  apellidos: string; // Opcional, dependiendo de tu modelo
  lista_id_compartida: any;
  // Añade otras propiedades del usuario si las necesitas
}
@Component({
  selector: 'app-modal-miembros-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-miembros-lista.component.html',
  styleUrl: './modal-miembros-lista.component.css'
})
export class ModalMiembrosListaComponent implements OnInit {
  // Aquí puedes definir las propiedades y métodos necesarios para el componente
  // Por ejemplo, si necesitas manejar una lista de miembros, puedes declararla aquí
  miembros: any[] = []; // Array para almacenar los miembros de la lista
  nombresMiembros: Usuario[] = []; // Esta será la lista de nombres para mostrar
  apellidosMiembros: string[] = []; // Esta será la lista de nombres para mostrar

  isLoading: boolean = true; // Para mostrar un indicador de carga

  constructor(private userService:UserService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ModalMiembrosListaComponent>, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.obtenerMiembrosYNombres();
  }
  obtenerMiembrosYNombres() {
    this.userService.obtenerMiembrosLista(this.data.idLista).subscribe({
      next: (response) => {
        if (response != '') {
          this.miembros = JSON.parse(response) as MiembroDeLista[];
          this.nombresMiembros = []; // Limpia la lista antes de llenarla

          // Usamos Promise.all para esperar a que todas las consultas de usuarios terminen
          // antes de marcar isLoading como false.
          const userPromises = this.miembros.map(item => {
            return new Promise<void>((resolve, reject) => {
              this.userService.obtenerUsuario(item.miembro_id).subscribe({
                next: (usuarioResponse) => {
                  const usuario = JSON.parse(usuarioResponse) as Usuario;
                  usuario.lista_id_compartida = item.id; // Asignar lista_id_compartida
                  this.nombresMiembros.push(usuario);
                  console.log("Email del miembro:", usuario.email);
                  resolve();
                },
                error: (error) => {
                  console.error('Error al obtener el usuario:', error);
                  // Puedes decidir si quieres que un error en un usuario impida el resto
                  // En este caso, simplemente registramos el error y continuamos.
                  resolve(); // Resolvemos para que el Promise.all no se detenga
                }
              });
            });
          });

          Promise.all(userPromises).then(() => {
            this.isLoading = false; // Todas las consultas de usuarios han terminado
          }).catch(error => {
            console.error('Error en alguna promesa de usuario:', error);
            this.isLoading = false; // Asegúrate de ocultar el cargador incluso con errores
          });

        } else {
          this.isLoading = false; // No hay miembros, ocultar el cargador
        }
        console.log(JSON.parse(response));
      },
      error: (error) => {
        console.error('Error al obtener miembros de la lista:', error);
        this.isLoading = false; // Ocultar el cargador en caso de error
      }
    });
  }
  cargarMiembros(): void {
    // Lógica para cargar los miembros de la lista
    // Esto podría ser una llamada a un servicio que obtenga los datos desde un backend
  }
  // Puedes añadir un método para cerrar el modal si es un modal
  cerrarModal(): void {
    this.dialogRef.close();
  }
      openEliminarMiembro(idListaCompartida: number) {
      this.dialog.open(ModalEliminarMiembroComponent, {
        width: 'auto',
        data: { idListaCompartida: idListaCompartida } // Pasamos el id de la lista compartida al modal
      });
    }
}
