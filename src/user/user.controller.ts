import { Controller, Post, Get, Body, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import * as jwt from 'jsonwebtoken';
import { Response, Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 🟢 Registrar Usuario y devolver JWT en cookies
  @Post('register')
  async register(
    @Body() body: any,
    @Res() res: Response
  ) {
    const user = await this.userService.registerUser(
      body.nombre,
      body.apellido,
      body.identificacion,
      body.mail,
      body.telefono,
      body.direccion,
      body.estado,
      body.idPlan,
    );

    if (!user) {
      return res.status(400).json({ message: 'Error al registrar usuario' });
    }

    // 🔑 Generar Token
    const token = jwt.sign({ userId: user.id }, 'SECRET_KEY', { expiresIn: '1h' });

    // 🍪 Guardar en Cookies
    res.cookie('token', token, { httpOnly: true, secure: false });

    return res.json({ message: 'Usuario registrado', token });
  }

  // 🔍 Obtener Usuarios
  @Get()
  async getUsers(@Req() req: Request) {
    const users = await this.userService.getUsers();
    return { users };
  }
}
