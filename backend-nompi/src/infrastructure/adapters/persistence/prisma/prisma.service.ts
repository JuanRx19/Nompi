import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Estos delegates existen en runtime (generados por Prisma), pero en algunos
  // entornos TypeScript puede fallar al resolver los tipos generados.
  // Declararlos evita errores de compilación sin afectar runtime.
  declare customer: any;
  declare product: any;
  declare transaction: any;
  declare delivery: any;

  async onModuleInit() {
    await this.$connect();
  }
}
