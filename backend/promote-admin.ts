import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
