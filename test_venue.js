const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
prisma.venue.findFirst({where: {id: 1}}).then(console.log).finally(()=>prisma.$disconnect());
