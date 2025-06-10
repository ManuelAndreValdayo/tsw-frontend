import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../list.service';
import { ListaCompraResumenDTO } from '../models/lista-resumen.dto';

@Component({
  selector: 'app-invitation-view',
  templateUrl: './invitation-view.component.html',
  styleUrls: ['./invitation-view.component.css']
})
export class InvitationViewComponent implements OnInit {
  invitationData: ListaCompraResumenDTO | null = null;
  loading = false;
  error: string | null = null;
  invToken!: string;

  constructor(
    private route: ActivatedRoute,
    private listSvc: ListService,
    private router: Router
  ) {}

  ngOnInit() {
    this.invToken = this.route.snapshot.paramMap.get('invToken')!;
    this.loadInvitationData();
  }

  loadInvitationData() {
    this.listSvc.viewInvitation(this.invToken).subscribe({
      next: data => this.invitationData = data,
      error: err => this.error = 'Error al cargar la invitación'
    });
  }

  onAccept() {
    this.loading = true;
    this.listSvc.acceptInvitation(this.invToken).subscribe({
      next: () => {
        // Tras aceptar, redirigir al detalle de la lista compartida
        this.router.navigate(['/listas', this.invitationData!.id]);
      },
      error: () => {
        this.error = 'Error al aceptar la invitación';
        this.loading = false;
      }
    });
  }

  onCancel() {
    // Volver atrás o a mis listas
    this.router.navigate(['/listas']);
  }
}