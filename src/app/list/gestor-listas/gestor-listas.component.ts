import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AddEditListDialogComponent } from '../../add-edit-list-dialog/add-edit-list-dialog.component';
import { AppComponent } from '../../app.component';
import { MtoUrlComponent } from '../../mto-url/mto-url.component';
import { ListService } from '../list.service';
import { ListaCompraResumenDTO } from '../models/lista-resumen.dto';

@Component({
  selector: 'app-gestor-listas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    // MatButtonModule,
    MtoUrlComponent
  ],
  templateUrl: './gestor-listas.component.html',
  styleUrls: ['./gestor-listas.component.css']
})
export class GestorListasComponent implements OnInit {
  // datos originales y filtrados
  listas: ListaCompraResumenDTO[] = [];
  originales: ListaCompraResumenDTO[] = [];

  // búsqueda
  searchQuery = '';

  // compartir
  sharedModal = false;
  url = '';

  constructor(private listSvc: ListService, private app : AppComponent, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadListas();
  }

  private loadListas(): void {
    this.listSvc.getMyLists().subscribe({
      next: data => {
        this.originales = data;
        this.listas = [...data];
      },
      error: err => this.app.openGlobalModal('error','Error cargando listas.')
    });
  }

  // --- BÚSQUEDA ---
  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    this.listas = q
      ? this.originales.filter(l => l.nombre.toLowerCase().includes(q))
      : [...this.originales];
  }

  // --- CREAR / EDITAR ---

openCreateModal(): void {
  const dialogRef = this.dialog.open(AddEditListDialogComponent, {
    data: { 
      action: 'create',
      currentName: '' 
    },
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result?.nombre) {
      this.listSvc.createList({ nombre: result.nombre }).subscribe({
        next: () => {
          this.loadListas();
          this.app.openGlobalModal('info', 'Lista creada correctamente.');
        },
        error: () => {
          this.app.openGlobalModal('error', 'Error creando la lista.');
        }
      });
    }
  });
}

openEditModal(lista: ListaCompraResumenDTO): void {
  const dialogRef = this.dialog.open(AddEditListDialogComponent, {
    data: { 
      action: 'edit',
      currentName: lista.nombre 
    },
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result?.nombre) {
      this.listSvc.updateList(lista.id, { nombre: result.nombre }).subscribe({
        next: () => {
          this.loadListas();
          this.app.openGlobalModal('info', 'Lista modificada correctamente.');
        },
        error: () => {
          this.app.openGlobalModal('error', 'Error modificando la lista.');
        }
      });
    }
  });
}
  
  // --- BORRAR ---
  confirmDelete(id: number, nombre: string): void {
    this.app.openGlobalModal(
      'confirmación',
      `¿Estás seguro de eliminar la lista "${nombre}"?`,
      () => this.deleteListAndReload(id)
    );
  }

  private deleteListAndReload(id: number) {
    this.listSvc.deleteList(id).subscribe({
      next: () => this.app.openGlobalModal('info','Lista eliminada correctamente.'),
      error: () => this.app.openGlobalModal('error','Error borrando lista.'),
      complete: () => this.loadListas()
    });
  }

  // --- COMPARTIR ---
compartirLista(listaId: number) {
  this.listSvc.createInvitation(listaId).subscribe({
    next: (invToken: string) => {
      // Construir la URL correcta según tu backend
      this.url = `${window.location.origin}/#/invitaciones/${invToken}`;
      
      // Mostrar el modal con la nueva URL
      this.dialog.open(MtoUrlComponent, {
        data: { url: this.url },
        width: '500px'
      }).afterClosed().subscribe(() => {
        // Opcional: cualquier limpieza al cerrar
      });
    },
    error: err => {
      console.error('Error creando invitación', err);
      this.app.openGlobalModal('error', 'Error al generar el enlace de compartir');
    }
  });
}

  cerrarShare(): void {
    this.sharedModal = false;
  }
}