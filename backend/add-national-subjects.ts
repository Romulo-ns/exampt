import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const subjects = [
  { name: 'Física e Química A', slug: 'fq-a', examCode: 'FQA' },
  { name: 'Filosofia', slug: 'fil', examCode: 'FIL' },
  { name: 'Geografia A', slug: 'geo-a', examCode: 'GEO-A' },
  { name: 'História A', slug: 'his-a', examCode: 'HIS-A' },
  { name: 'Economia A', slug: 'eco-a', examCode: 'ECO-A' },
  { name: 'Inglês', slug: 'ing', examCode: 'ING' },
  { name: 'Geometria Descritiva A', slug: 'gd-a', examCode: 'GD-A' },
  { name: 'Matemática B', slug: 'mat-b', examCode: 'MAT-B' },
  { name: 'Matemática Aplicada às Ciências Sociais', slug: 'macs', examCode: 'MACS' },
  { name: 'Desenho A', slug: 'des-a', examCode: 'DES-A' },
  { name: 'Latim A', slug: 'lat-a', examCode: 'LAT-A' },
  { name: 'Língua Estrangeira I, II ou III', slug: 'le-iii', examCode: 'LE-III' },
];

async function main() {
  console.log('🚀 Adding Portuguese National Exam subjects...');

  for (const sub of subjects) {
    const result = await prisma.subject.upsert({
      where: { slug: sub.slug },
      update: { name: sub.name, examCode: sub.examCode },
      create: sub,
    });
    console.log(`✅ ${result.name} (${result.examCode})`);
  }

  console.log('🎉 All subjects added successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
