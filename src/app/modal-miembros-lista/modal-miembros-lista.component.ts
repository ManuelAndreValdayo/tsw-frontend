import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { ListaCompraService } from '../listaCompra.service';
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
  lista_id: any; // Puedes tipar esto mejor si conoces la estructura
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
  compartida: boolean = false; // Para saber si la lista es compartida

  isLoading: boolean = true; // Para mostrar un indicador de carga

  constructor(private userService:UserService,private listaCompraService:ListaCompraService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ModalMiembrosListaComponent>, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.obtenerMiembrosYNombres();
  }
  obtenerMiembrosYNombres() {
    this.listaCompraService.obtenerMiembrosLista(this.data.idLista).subscribe({
      next: (response) => {
        if (response != '') {
          this.miembros = JSON.parse(response) as MiembroDeLista[];
          this.nombresMiembros = []; // Limpia la lista antes de llenarla
          this.compartida = this.data.compartida; // Asigna el valor de compartida desde los datos del modal
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
      },
      error: (error) => {
        console.error('Error al obtener miembros de la lista:', error);
        this.isLoading = false; // Ocultar el cargador en caso de error
      }
    });
  }
  // Puedes añadir un método para cerrar el modal si es un modal
  cerrarModal(): void {
    this.dialogRef.close();
  }
      openEliminarMiembro(idListaCompartida: number) {
      this.dialog.open(ModalEliminarMiembroComponent, {
        width: 'auto',
        data: { 
                idListaCompartida: idListaCompartida,
                idLista: this.data.idLista ,
                recargar: () => this.obtenerMiembrosYNombres() // Pasamos el id de la lista al modal
         } // Pasamos el id de la lista compartida al modal
      });
    }
}
