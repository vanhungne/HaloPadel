import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const sections = await prisma.landingSection.findMany()
  console.log('Current sections count:', sections.length)
  
  if (sections.length > 0) {
    // Delete them all
    await prisma.landingSection.deleteMany({})
    console.log('Deleted all existing sections.')
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
