import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LoginService } from './login.service';
import { CrackDto, LoginDto } from './dto/login';
import { MessageDto } from '../chat/dto/message';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { createReadStream } from 'fs';
import * as readline from 'readline';

@Controller('login')
export class LoginController {

  constructor(
    private loginService: LoginService,
    private httpService: HttpService
  ) { }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.loginService.login(loginDto);

  }


  @Get('user')
  async GetUser(@Query('id') idUser: string) {
    return this.loginService.GetUser(parseInt(idUser));
  }
}
