/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as cookieParser from "cookie-parser"
import { json } from "express"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	//console.log = function () { }

	app.use(cookieParser())
	app.use(json({ limit: '100kb' }));

	app.enableCors({
		allowedHeaders: "*",
		origin: "*",
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: false,
	})
	await app.listen(3000)
}

bootstrap()
