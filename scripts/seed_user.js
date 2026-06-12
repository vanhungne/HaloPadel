const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

process.env.DATABASE_URL = "sqlserver://161.248.179.171:1433;database=halopadels;user=sa;password=P@delHubs2026!Str0ngSQL;trustServerCertificate=true"

async function main() {
  const email = 'halosportsid@gmail.com'
  const password = 'Halosportsid@2511'
  
  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      fullName: 'Halo Sports Admin',
      isActive: true,
    },
    create: {
      email,
      passwordHash,
      fullName: 'Halo Sports Admin',
      isActive: true,
    },
  })

  console.log(`User created/updated: ${user.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
