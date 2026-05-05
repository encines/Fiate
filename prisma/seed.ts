import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Limpiar base de datos
  await prisma.serviceHistory.deleteMany()
  await prisma.userCar.deleteMany()
  await prisma.maintenanceTask.deleteMany()
  await prisma.catalogCar.deleteMany()
  await prisma.carModel.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.user.deleteMany()

  // Crear Usuario
  const hashedPassword = await bcrypt.hash('123456', 10)
  
  const user = await prisma.user.create({
    data: {
      name: 'Carlos',
      email: 'carlos@example.com',
      password: hashedPassword,
    },
  })

  // Crear Marcas
  const fiat = await prisma.brand.create({ data: { name: 'Fiat' } })
  const bmw = await prisma.brand.create({ data: { name: 'BMW' } })
  const nissan = await prisma.brand.create({ data: { name: 'Nissan' } })
  const toyota = await prisma.brand.create({ data: { name: 'Toyota' } })

  // Crear Modelos
  const unoWay = await prisma.carModel.create({
    data: { name: 'Uno Way', brandId: fiat.id },
  })
  const serie7 = await prisma.carModel.create({
    data: { name: 'Serie 7', brandId: bmw.id },
  })
  const march = await prisma.carModel.create({
    data: { name: 'March', brandId: nissan.id },
  })
  const corolla = await prisma.carModel.create({
    data: { name: 'Corolla', brandId: toyota.id },
  })

  // Crear Autos de Catálogo
  const fiatCatalog = await prisma.catalogCar.create({
    data: { year: 2017, engine: '1.4L', modelId: unoWay.id },
  })
  const bmwCatalog = await prisma.catalogCar.create({
    data: { year: 2022, trim: '740i M Sport', modelId: serie7.id },
  })
  const nissanCatalog = await prisma.catalogCar.create({
    data: { year: 2016, engine: '1.6L', modelId: march.id },
  })
  const toyotaCatalog = await prisma.catalogCar.create({
    data: { year: 2015, engine: '1.8L', modelId: corolla.id },
  })

  // Tareas de mantenimiento removidas del seed porque ahora se asocian a UserCar y el usuario no tiene autos por defecto.

  // * Ya no asignamos vehículos al usuario por defecto para que comience con el garaje vacío *

  console.log('Semilla insertada correctamente ✅')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
