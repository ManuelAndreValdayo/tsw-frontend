import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ListaCompraResumenDTO } from './models/lista-resumen.dto';
import { NuevaListaDTO } from './models/nueva-lista.dto';

@Injectable({ providedIn: 'root' })
export class ListService {
  private baseUrl = `${environment.apiListUrl}`;  // debería apuntar a http://localhost:9000/api/listas

  constructor(private http: HttpClient) {}

  /** Obtiene el resumen de listas del usuario logueado */
  getMyLists(): Observable<ListaCompraResumenDTO[]> {
    return this.http.get<ListaCompraResumenDTO[]>(this.baseUrl);
  }

  /** Crea una nueva lista */
  createList(dto: NuevaListaDTO): Observable<ListaCompraResumenDTO> {
    return this.http.post<ListaCompraResumenDTO>(this.baseUrl, dto);
  }

  /** Modifica el nombre de una lista existente */
  updateList(id: number, dto: NuevaListaDTO): Observable<ListaCompraResumenDTO> {
    return this.http.put<ListaCompraResumenDTO>(`${this.baseUrl}/${id}`, dto);
  }

  /** Elimina una lista */
  deleteList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** Crear invitación para compartir lista */
  createInvitation(listaId: number): Observable<string> {
    return this.http.post<{token: string}>(`${this.baseUrl}/${listaId}/invitaciones`, {})
    .pipe(
      map(result => result.token)
    );
  }

  /** Ver información de invitación */
  viewInvitation(invToken: string): Observable<ListaCompraResumenDTO> {
    return this.http.get<ListaCompraResumenDTO>(`${this.baseUrl}/invitaciones/${invToken}`);
  }

  /** Aceptar invitación */
  acceptInvitation(invToken: string): Observable<ListaCompraResumenDTO> {
    return this.http.post<ListaCompraResumenDTO>(`${this.baseUrl}/invitaciones/${invToken}/accept`, {});
  }
}
