import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  // 🟢 Llamar al SP para registrar un usuario
  async registerUser(
    nombre: string,
    apellido: string,
    identificacion: string,
    mail: string,
    telefono: string,
    direccion: string,
    estado: boolean,
    idPlan: number,
  ): Promise<any> {
    const result = await this.dataSource.query(
      `SELECT db_sp_users_set($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [null, nombre, apellido, identificacion, mail, telefono, direccion, estado, idPlan],
    );

    return result;
  }

  // 🔍 Llamar al SP para obtener usuarios
  async getUsers(
    id?: number,
    nombre?: string,
    apellido?: string,
    identificacion?: string,
    mail?: string,
    idPlan?: number,
    estado?: boolean,
  ): Promise<any> {
    return this.dataSource.query(
      `SELECT * FROM db_sp_users_get($1, $2, $3, $4, $5, $6, $7)`,
      [id || null, nombre || null, apellido || null, identificacion || null, mail || null, idPlan || null, estado || null],
    );
  }
}
