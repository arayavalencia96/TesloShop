import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto, CreateUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorator';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkOutStatus(@GetUser() user: User) {
    return this.authService.checkOutStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') email: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      ok: true,
      message: 'Ruta privada',
      user,
      email,
      rawHeaders,
    };
  }

  // Una manera de verificar el role @SetMetadata('roles', ['admin', 'super-user'])

  @Get('private2')
  @UseGuards(AuthGuard(), UserRoleGuard)
  @RoleProtected(ValidRoles.superUser)
  privateRoute2() {
    return {
      ok: true,
      message: 'Ruta privada',
    };
  }

  // Con el siguiente controlador, se verifica y permite obtener datos cualquier user de la bbdd
  @Get('private3')
  @Auth()
  allLoggedInUsers(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Ruta privada',
      user,
    };
  }

  // Con el siguiente controlador, se verifica y permite obtener datos los usuarios admin
  @Get('private4')
  @Auth(ValidRoles.admin)
  onlyAdminUsers(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Ruta privadaa',
      user,
    };
  }
}
