import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

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
    try {
      // Llamar al SP con NULL como primer parámetro para nuevo registro
      const [result] = await this.dataSource.query(
        `SELECT * FROM db_sp_users_get(NULL, $1, NULL, $2, $3, NULL, $4)`,
        [nombre, identificacion, mail, estado]
      );

      // Si no existe un usuario con el mismo nombre/identificación/mail, proceder a crear
      if (!result) {
        const [newUser] = await this.dataSource.query(
          `SELECT * FROM db_sp_users_set($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            null,           // _id NULL para nuevo registro
            nombre,         // _nombre
            apellido,       // _apellido
            identificacion, // _identificacion
            mail,          // _mail
            telefono,      // _telefono
            direccion,     // _direccion
            estado,        // _estado
            idPlan,        // *id*plan
            'I'            // operación Insert
          ]
        );

        if (!newUser) {
          throw new BadRequestException('Error al crear el usuario');
        }

        return newUser;
      } else {
        throw new BadRequestException('Ya existe un usuario con estos datos');
      }
    } catch (error) {
      console.error('Error en registerUser:', error);
      throw new BadRequestException(
        `Error al registrar usuario: ${error.message || 'Error desconocido'}`
      );
    }
  }

  async getUsers(
    id?: number,
    nombre?: string,
    apellido?: string,
    identificacion?: string,
    mail?: string,
    idPlan?: number,
    estado: boolean = true, // Por defecto traer solo activos
  ): Promise<any> {
    try {
      const users = await this.dataSource.query(
        `SELECT * FROM db_sp_users_get($1, $2, $3, $4, $5, $6, $7)`,
        [id, nombre, apellido, identificacion, mail, idPlan, estado]
      );

      return users || [];
    } catch (error) {
      console.error('Error en getUsers:', error);
      throw new BadRequestException(`Error al obtener usuarios: ${error.message}`);
    }
  }
}