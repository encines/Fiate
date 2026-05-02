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

  // Crear Tareas de Mantenimiento genéricas por auto (simulado de manual)
  
  const bmwTasks = await Promise.all([
    prisma.maintenanceTask.create({ data: { name: 'Cambio de aceite', frequencyKm: 10000, catalogCarId: bmwCatalog.id } }),
    prisma.maintenanceTask.create({ data: { name: 'Alineación y balanceo', frequencyKm: 15000, catalogCarId: bmwCatalog.id } }),
    prisma.maintenanceTask.create({ data: { name: 'Llantas', frequencyKm: 40000, catalogCarId: bmwCatalog.id } }),
    prisma.maintenanceTask.create({ data: { name: 'Frenos', frequencyKm: 30000, catalogCarId: bmwCatalog.id } }),
    prisma.maintenanceTask.create({ data: { name: 'Cambio de filtros', frequencyKm: 20000, catalogCarId: bmwCatalog.id } }),
    prisma.maintenanceTask.create({ data: { name: 'Afinación', frequencyKm: 25000, catalogCarId: bmwCatalog.id } }),
  ])

  const fiatTasks = await Promise.all([
    prisma.maintenanceTask.create({ data: { name: 'Cambio de aceite y filtro de aceite', frequencyKm: 10000, catalogCarId: fiatCatalog.id } }),
    prisma.maintenanceTask.create({ data: { name: 'Sustitución de filtro de aire', frequencyKm: 10000, catalogCarId: fiatCatalog.id } }),
    prisma.maintenanceTask.create({ data: { name: 'Control de alineado y rotación', frequencyKm: 10000, catalogCarId: fiatCatalog.id } }),
    prisma.maintenanceTask.create({ data: { name: 'Sustitución de filtro antipolen', frequencyKm: 20000, catalogCarId: fiatCatalog.id } }),
    prisma.maintenanceTask.create({ data: { name: 'Sustitución de bujías', frequencyKm: 40000, catalogCarId: fiatCatalog.id } }),
    prisma.maintenanceTask.create({ data: { name: 'Sustitución de filtro de combustible', frequencyKm: 40000, catalogCarId: fiatCatalog.id } }),
    prisma.maintenanceTask.create({ data: { name: 'Correa de distribución', frequencyKm: 60000, catalogCarId: fiatCatalog.id } }),
    prisma.maintenanceTask.create({ data: { name: 'Sustitución de líquido de frenos', frequencyKm: 60000, catalogCarId: fiatCatalog.id } }),
  ])

  // Nuevas Tareas para Nissan March
  await Promise.all([
    prisma.maintenanceTask.create({ data: { name: 'Cambio de aceite', frequencyKm: 10000, catalogCarId: nissanCatalog.id } }),
    prisma.maintenanceTask.create({ data: { name: 'Afinación', frequencyKm: 20000, catalogCarId: nissanCatalog.id } }),
  ])

  // Nuevas Tareas para Toyota Corolla
  await Promise.all([
    prisma.maintenanceTask.create({ data: { name: 'Cambio de aceite sintético', frequencyKm: 15000, catalogCarId: toyotaCatalog.id } }),
    prisma.maintenanceTask.create({ data: { name: 'Revisión General', frequencyKm: 30000, catalogCarId: toyotaCatalog.id } }),
  ])

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
