import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  public usuario: Usuario = new Usuario('');

  constructor(private socket: Socket, private router: Router) {
    this.cargarStorage();
    this.checkStatus();
  }

  checkStatus() {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socketStatus = true;
      this.cargarStorage();
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      this.socketStatus = false;
    });
  }

  emit( evento: string, payload?: any, callback?: Function ) {
    console.log('Emitiendo', evento);
    this.socket.emit( evento, payload, callback );
  }

  listen( evento: string ) {
    return this.socket.fromEvent( evento );
  }

  loginWS( nombre: string ) {
    return new Promise<void>( (resolve, reject ) => {
      this.emit('configurar-usuario', { nombre: nombre }, (resp: any) => {
        this.usuario = new Usuario( nombre );
        this.guardarStorage();
        resolve();
      });
    });
  }

  logoutWS() {
    this.usuario = {} as Usuario;
    localStorage.removeItem('usuario-chat');
    const payload = {
      nombre: 'sin-nombre'
    }
    this.emit('configurar-usuario', payload, () => {});
    this.router.navigateByUrl('');
  }

  getUsuario() {
    return this.usuario;
  }

  guardarStorage() {
    localStorage.setItem('usuario-chat', JSON.stringify( this.usuario ));
  }

  cargarStorage() {
    let usuario = localStorage.getItem('usuario-chat');
    if( usuario ) {
      this.usuario = JSON.parse( usuario );
      this.loginWS ( this.usuario.nombre );
    }
  }

}
