import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:9090/users';
  private apiUrl2 = 'http://localhost:9000/listaCompra';

  constructor(private http: HttpClient) {}

  register1(email : string, pwd1 : string, pwd2 : string, nombre : string, apellidos : string, telefono : string) {
    let info = {
      Email : email,
      Pwd1 : pwd1, 
      Pwd2 : pwd2,
      Nombre: nombre,
      Apellidos: apellidos,
      Telefono: telefono
    }
    return this.http.post<any>(`${this.apiUrl}/registrarUser`, info);
  }
  login(email : string, pwd : string) {
    let info = {
      Email : email,
      Pwd : pwd
    }
    var response = this.http.put<any>(`${this.apiUrl}/login`, info, { responseType: 'text' as 'json', withCredentials : true}).pipe();
    return response;
  }
  restablecerPassword(pwd1 : string, pwd2 : string, token : any) {
    let info = {
      pwd1 : pwd1,
      pwd2 : pwd2,
      Token : token
    }
    var response = this.http.post<any>(`${this.apiUrl}/restablecerPassword`, info, { responseType: 'text' as 'json', withCredentials : true}).pipe();
    return response;
  }
  validarCuenta(token : string) {
    let info = {
      Token : token
    }
    var response = this.http.post<any>(`${this.apiUrl}/validarCuenta`, info, { responseType: 'text' as 'json', withCredentials : true}).pipe();
    return response;
  }
  validarCuentaRecuperarPassword(token : string) {
    let info = {
      Token : token
    }
    var response = this.http.post<any>(`${this.apiUrl}/validarCuentaRecuperarPassword`, info, { responseType: 'text' as 'json', withCredentials : true}).pipe();
    return response;
  }
  sendEmail(email : string) {
    let info = {
      Email : email
    }
    var response = this.http.post<any>(`${this.apiUrl}/sendRecoveryPassword`, info, { responseType: 'text' as 'json', withCredentials : true}).pipe();
    return response;
  }
  cerrarSesion() {
    return this.http.post<any>(`${this.apiUrl}/cerrarSesion`, {}, {withCredentials : true}).pipe();
  }
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
  eliminarMiembroLista(id: number) {
    const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    let info = {
      id: id
    } 
    return this.http.post<any>(`${this.apiUrl}/eliminarMiembroLista`,info, {headers, responseType: 'text' as 'json', withCredentials : true})
  }
  obtenerUsuario(id : string) {
    const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    // return this.http.get<any>(`${this.apiUrl}/prueba`, { responseType: 'text' as 'json', withCredentials : true})
    return this.http.get<any>(`${this.apiUrl}/obtenerUsuario/${id}`, { headers, responseType: 'text' as 'json', withCredentials : true});
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
  obtenerProducto(id: number){
    return this.http.get<any>(`${this.apiUrl2}/getProducto/${id}`, { responseType: 'text' as 'json', withCredentials : true})
  }

  anadirProducto(nombre : string, cantidad : number, idLista: number) {
    let info = {
      nombre : nombre,
      cantidad : cantidad,
      id_lista_compra : idLista
    }
    // return this.http.get<any>(`${this.apiUrl}/prueba`, { responseType: 'text' as 'json', withCredentials : true})
    return this.http.post<any>(`${this.apiUrl2}/anadirProducto`, info, { responseType: 'text' as 'json', withCredentials : true}).pipe();
  }
  anadirProductoWs(nombre : string, cantidad : number, idLista: number, ws: any) {
    let info = {
      nombre : nombre,
      cantidad : cantidad,
      id_lista_compra : idLista
    }
    ws.send(JSON.stringify(info));
    // return this.http.get<any>(`${this.apiUrl}/prueba`, { responseType: 'text' as 'json', withCredentials : true})
    // return this.http.post<any>(`${this.apiUrl2}/anadirProducto`, info, { responseType: 'text' as 'json', withCredentials : true}).pipe();
  }
  modificarProducto(id: number,nombre : string, cantidad : number) {
    const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    let info = {
      id: id,
      nombre : nombre,
      cantidad : cantidad
    }
    // return this.http.get<any>(`${this.apiUrl}/prueba`, { responseType: 'text' as 'json', withCredentials : true})
    return this.http.put<any>(`${this.apiUrl2}/modificarProducto`, info, { headers, responseType: 'text' as 'json', withCredentials : true}).pipe();
  }
  checkLogin(){
    const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    return this.http.get<any>(`${this.apiUrl}/checkLogin`, { headers, responseType: 'text' as 'json', withCredentials : true})
  }
  checkPremium(){
    const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    return this.http.get<any>(`${this.apiUrl2}/verify-premium`, { headers, responseType: 'text' as 'json', withCredentials : true})
  }
// LISTAS Y PRODUCTOS COMPARTIDOS
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
  obtenerProductos(idLista: number){
    return this.http.get<any>(`${this.apiUrl2}/getAllProductos/${idLista}`, { responseType: 'text' as 'json', withCredentials : true})
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
  eliminarProducto(id: number){
        const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
    const headers = {
        'Authorization' : `Bearer ${token}`
    }
    return this.http.delete<void>(`${this.apiUrl2}/eliminarProducto/${id}`, {headers, withCredentials : true})
  }

}
