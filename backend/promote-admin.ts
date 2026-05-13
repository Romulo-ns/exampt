import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Por favor, fornece o email do utilizador. Exemplo: npx ts-node promote-admin.ts user@exampt.pt');
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    console.log(`Sucesso! O utilizador ${user.nick} (${user.email}) é agora um ADMIN.`);
  } catch (error) {
    console.error(`Erro ao promover utilizador: o email '${email}' existe na base de dados?`);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
