import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

await p.venue.update({
  where: { id: 1 },
  data: {
    address: 'Đường Nguyễn Tri Phương, Phường Hoà Xuân, Quận Cẩm Lệ, TP. Đà Nẵng',
    googleMapsUrl: 'https://www.google.com/maps?q=16.0629648,108.2439727',
    googleMapsEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3834.8!2d108.2439727!3d16.0629648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTbCsDAzJzQ2LjciTiAxMDjCsDE0JzM4LjMiRQ!5e0!3m2!1svi!2svn!4v1" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  },
})

console.log('✅ Venue location updated to Da Nang coordinates')
await p.$disconnect()
