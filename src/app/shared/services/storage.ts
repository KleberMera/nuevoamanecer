import { Injectable, signal } from '@angular/core';
import { Usuario } from '../../core/models/usuario';

@Injectable({
  providedIn: 'root',
})
export class Storage {
  private readonly _storage = localStorage;
  private readonly _userId = signal<string>('user');

  get<T>(key: string): T | null {
    const value = this._storage.getItem(key);
    if (!value) return null;

    return JSON.parse(value) as T;
  }

  set<T>(key: string, value: T) {
    this._storage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    this._storage.removeItem(key);
  }

  getUsuarioId() {
    const dataUser: Usuario | null = this.get<Usuario>(this._userId());
    return dataUser?.id as number;
  }

  getNombreRol(): string | null {
    const dataUser: Usuario | null = this.get<Usuario>(this._userId());
    return dataUser?.rol?.nombre as string;
  }

  getNombreUsuario(): string | null {
    ///toma el nombre1 y apellido1 del usuario
    const dataUser: Usuario | null = this.get<Usuario>(this._userId());
    if (!dataUser) return null;
    return `${dataUser.nombre1} ${dataUser.apellido1}`;
  }

  getLabelAvatar(): string | null {
    //Tomar la primera letra del nombre1 y apellido1 del usuario
    const dataUser: Usuario | null = this.get<Usuario>(this._userId());
    if (!dataUser) return null;
    const nombre1 = dataUser.nombre1 ? dataUser.nombre1.charAt(0).toUpperCase() : '';
    const apellido1 = dataUser.apellido1 ? dataUser.apellido1.charAt(0).toUpperCase() : '';
    return `${nombre1}${apellido1}`;
  }
}
