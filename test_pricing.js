const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
prisma.pricingPlan.findMany().then(console.log).finally(()=>prisma.$disconnect());
