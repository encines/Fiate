import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed de catálogo...')

  // Marcas
  const marcas = ['Fiat', 'BMW', 'Nissan', 'Toyota']
  for (const nombre of marcas) {
    await prisma.brand.upsert({
      where: { name: nombre },
      update: {},
      create: { name: nombre },
    })
  }

  // Modelos y Catálogos
  const fiat = await prisma.brand.findUnique({ where: { name: 'Fiat' } })
  if (fiat) {
    const unoWay = await prisma.carModel.upsert({
      where: { name_brandId: { name: 'Uno Way', brandId: fiat.id } },
      update: {},
      create: { name: 'Uno Way', brandId: fiat.id },
    })
    await prisma.catalogCar.upsert({
      where: { modelId_year: { modelId: unoWay.id, year: 2017 } },
      update: {},
      create: { year: 2017, engine: '1.4L', modelId: unoWay.id },
    })
  }

  const bmw = await prisma.brand.findUnique({ where: { name: 'BMW' } })
  if (bmw) {
    const serie7 = await prisma.carModel.upsert({
      where: { name_brandId: { name: 'Serie 7', brandId: bmw.id } },
      update: {},
      create: { name: 'Serie 7', brandId: bmw.id },
    })
    await prisma.catalogCar.upsert({
      where: { modelId_year: { modelId: serie7.id, year: 2022 } },
      update: {},
      create: { year: 2022, trim: '740i M Sport', modelId: serie7.id },
    })
  }

  const nissan = await prisma.brand.findUnique({ where: { name: 'Nissan' } })
  if (nissan) {
    const march = await prisma.carModel.upsert({
      where: { name_brandId: { name: 'March', brandId: nissan.id } },
      update: {},
      create: { name: 'March', brandId: nissan.id },
    })
    await prisma.catalogCar.upsert({
      where: { modelId_year: { modelId: march.id, year: 2016 } },
      update: {},
      create: { year: 2016, engine: '1.6L', modelId: march.id },
    })
  }

  const toyota = await prisma.brand.findUnique({ where: { name: 'Toyota' } })
  if (toyota) {
    const corolla = await prisma.carModel.upsert({
      where: { name_brandId: { name: 'Corolla', brandId: toyota.id } },
      update: {},
      create: { name: 'Corolla', brandId: toyota.id },
    })
    await prisma.catalogCar.upsert({
      where: { modelId_year: { modelId: corolla.id, year: 2015 } },
      update: {},
      create: { year: 2015, engine: '1.8L', modelId: corolla.id },
    })
  }

  console.log('Catálogo actualizado correctamente ✅ (Sin borrar datos de usuario)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
