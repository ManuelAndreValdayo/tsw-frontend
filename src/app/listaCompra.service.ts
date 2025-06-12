  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { webSocket } from 'rxjs/webSocket';
  
  @Injectable({
    providedIn: 'root'
  })
  export class ListaCompraService {
    private apiUrl2 = 'http://localhost:9000/listaCompra';
  
    constructor(private http: HttpClient) {}
  anadirLista(nombre : string) {
    const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    let info = {
      Nombre : nombre
    }
    // return this.http.get<any>(`${this.apiUrl}/prueba`, { responseType: 'text' as 'json', withCredentials : true})
    return this.http.post<any>(`${this.apiUrl2}/crearLista`, info, { headers, responseType: 'text' as 'json', withCredentials : true}).pipe();
  }
  eliminarMiembroLista(id: number, idLista: number) {
    const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    let info = {
      id: id,
      idLista: idLista
    } 
    return this.http.post<any>(`${this.apiUrl2}/eliminarMiembroLista`,info, {headers, responseType: 'text' as 'json', withCredentials : true})
  }
    modificarLista(id: number,nombre : string) {
        const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    let info = {
      id: id,
      Nombre : nombre
    }
    // return this.http.get<any>(`${this.apiUrl}/prueba`, { responseType: 'text' as 'json', withCredentials : true})
    return this.http.put<any>(`${this.apiUrl2}/modificarLista`, info, {headers, responseType: 'text' as 'json', withCredentials : true}).pipe();
  }
  obtenerLista(id: number){
    return this.http.get<any>(`${this.apiUrl2}/getLista/${id}`, { responseType: 'text' as 'json', withCredentials : true})
  }
  obtenerListasUsuario(){
    const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    return this.http.get<any>(`${this.apiUrl2}/getAllUserListas`, { headers, responseType: 'text' as 'json', withCredentials : true})
  }
  obtenerMiembrosLista(idLista: number){
    const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    return this.http.get<any>(`${this.apiUrl2}/obtenerMiembrosLista/${idLista}`, { headers, responseType: 'text' as 'json', withCredentials : true})
  }
    crearListaCompartida(idLista: number){
    const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    let info = {
      lista:  {
              "id": idLista
            }
    }
    return this.http.post<any>(`${this.apiUrl2}/crearInvitacion`, info,{ headers, responseType: 'text' as 'json', withCredentials : true , observe: 'response' }).pipe();
  }
  agregarUserListaCompartida(){
    const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
    const tokenListaCompartida = (sessionStorage.getItem('tokenListaCompartida')) ? sessionStorage.getItem('tokenListaCompartida') : "";
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    let info = {
      token: tokenListaCompartida
    }
    return this.http.post<any>(`${this.apiUrl2}/agregarUserListaCompartida`, info,{ headers, responseType: 'text' as 'json', withCredentials : true , observe: 'response' }).pipe();
  }
  eliminarLista(id: number){
    const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    return this.http.delete<void>(`${this.apiUrl2}/eliminarLista/${id}`, {headers, withCredentials : true})
  }
}