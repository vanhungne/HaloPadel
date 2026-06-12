const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function main() {
  await prisma.pricingPlan.deleteMany({ where: { id: { in: [6, 7, 8, 9, 10] } } });
  console.log('Cleaned');
}
main().finally(()=>prisma.$disconnect());
