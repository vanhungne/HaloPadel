import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import FloatingCTA from '@/components/public/FloatingCTA'
import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'

async function getVenue() {
  return await prisma.venue.findFirst({
    where: { id: VENUE_ID, isActive: true },
  })
}

export default async function PublicLayout({ children }) {
  const venue = await getVenue()

  return (
    <>
      <Header venue={venue} />
      <main className="flex-1" style={{ paddingTop: '76px' }}>
        <div className="md:pb-0 pb-16">
          {children}
        </div>
      </main>
      <Footer venue={venue} />
      <FloatingCTA venue={venue} />
    </>
  )
}
