import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const rawCars = [
  "Nissan Versa", "Chevrolet Aveo", "Nissan NP300", "Kia K3 Sedán", "Nissan March",
  "Mazda CX-30", "Nissan Kicks", "Volkswagen Virtus", "Nissan Sentra", "Hyundai Creta",
  "Mazda 2 Sedán", "Volkswagen Taos", "MG 5", "Chevrolet S10", "Volkswagen Jetta",
  "Toyota Hilux", "Volkswagen Tiguan", "Nissan Magnite", "Chevrolet Tornado Van", "Renault Kwid",
  "Chevrolet Groove", "RAM 700", "Chevrolet Captiva", "Nissan X-Trail", "Kia Seltos",
  "Toyota RAV4", "Mazda 3 Sedán", "Volkswagen Saveiro", "Mazda CX-5", "Ford Territory",
  "Kia K4 Sedán", "Kia Sonet", "Suzuki Swift", "RAM 1200", "Mitsubishi L200",
  "Hyundai Grand i10", "Geely Emgrand", "Toyota Avanza", "Chevrolet Onix", "Toyota Yaris Sedán",
  "Hyundai Grand i10 Sedán", "Honda CR-V", "Toyota Tacoma", "Volkswagen Taigun", "MG 3",
  "Honda HR-V", "Toyota Corolla", "Kia K3 Hatchback", "SEAT Ibiza", "JAC Frison",
  "Nissan Urvan", "Toyota Raize", "Suzuki Jimny", "Toyota Sienna", "Mazda CX-3",
  "Mitsubishi Outlander Sport", "Kia Sportage", "Dodge Attitude", "Haval Jolion", "Toyota Corolla Cross",
  "Ford Ranger", "Chevrolet Tracker", "Chevrolet Trax", "Toyota Highlander", "Dodge Journey",
  "Honda BR-V", "Volkswagen Polo", "Honda City", "Suzuki Ertiga", "Volkswagen Teramont",
  "Ford F-150", "Toyota Prius", "Chevrolet Silverado", "Hyundai Tucson", "Mazda 3 Hatchback",
  "Mazda 2 Hatchback", "Changan CS55", "Mitsubishi Xpander", "Ford Transit", "MG One",
  "Peugeot Partner", "Suzuki Fronx", "MG RX5", "GWM Poer", "Honda Civic",
  "Toyota Camry", "Peugeot Rifter", "Changan Alsvin", "Peugeot 2008", "Jeep Compass",
  "Chevrolet Cheyenne", "Ford Lobo", "Chevrolet Montana", "SEAT CUPRA León", "Ford Explorer",
  "Suzuki Ignis", "Volkswagen Tera", "Peugeot Partner Rapid", "GMC Sierra", "Geely Coolray",
  "Jeep Renegade", "CUPRA Formentor", "Volvo EX30", "Changan CS35 Plus", "Jeep Wrangler",
  "Mazda CX-90", "RAM 1500", "Fiat Pulse", "Ford Maverick", "JAC 8",
  "Haval H6", "Mazda CX-50", "JAC 4", "JAC 2", "Renault Oroch",
  "Chevrolet Suburban", "Mercedes-Benz Sprinter", "MG GT", "Volkswagen Crafter Chasis", "BMW X3",
  "Toyota Hiace", "Ford F-350", "SEAT Arona", "Renault Arkana", "Volkswagen Nivus",
  "Ford Bronco Sport", "Jeep Commander", "Jeep Grand Cherokee", "BMW X1", "MG ZS",
  "Hyundai HB20 Sedán", "Changan New Star Truck", "Mitsubishi Mirage G4", "Renault Kardian", "Buick Envista",
  "Mercedes-Benz GLC", "Ford Escape", "Geely EX5", "Changan Honor S", "JAC Sunray",
  "Chevrolet Colorado", "Suzuki Baleno", "Volkswagen Amarok", "Toyota Yaris Hatchback", "Chevrolet Tahoe",
  "MG HS", "Renault Duster", "Audi A3", "Subaru Crosstrek MHEV", "GMC Terrain",
  "Subaru Forester", "Audi Q5", "RAM DS", "Renault Kangoo", "Geely Cityray",
  "CUPRA Terramar", "Changan EADO Plus", "Mercedes-Benz GLE", "Kia Sorento", "Volkswagen Transporter",
  "Honda Pilot", "RAM 4000", "Changan Hunter", "Chirey Tiggo 2", "GMC Canyon Crew Cab 4x4",
  "BMW X5", "MINI Cooper 3 puertas", "Chevrolet Traverse", "Jeep JT", "BMW Serie 2",
  "Volkswagen Caddy", "Toyota 4Runner", "Volkswagen Golf GTI", "GMC Yukon", "Honda Odyssey",
  "Suzuki Dzire", "Cadillac Escalade ESV", "Nissan Frontier V6", "BMW X6", "Peugeot 3008",
  "Renault Koleos", "Peugeot Manager HDi", "Volvo XC60", "Mazda MX-5", "JAC X350",
  "Jetour T2", "Audi Q3 Sportback", "Geely Starray", "Chevrolet Spark EUV", "Mazda BT-50",
  "BMW X2", "SEAT Ateca", "Suzuki Grand Vitara", "GMC Acadia", "Lincoln Nautilus",
  "Isuzu ELF 300", "Ford Bronco", "Fiat Fastback", "Lexus NX", "Ford F-450",
  "Porsche Cayenne", "Fiat Argo", "Omoda O5", "Kia Niro", "Geely GX3 Pro",
  "BMW X4", "MINI Countryman", "Ford Expedition", "GWM Tank 300", "Omoda C5",
  "Ford F-550", "Mitsubishi Outlander PHEV", "Renault Logan", "Audi Q3", "Ford Mustang",
  "Geely Monjaro", "Ford F-250", "Foton Tunland", "Porsche 911", "BMW Serie 3",
  "Honda Accord", "BMW Serie 1", "Hyundai Santa Fe", "Chevrolet Express Max", "Kia K4 Hatchback",
  "Toyota Tundra", "Range Rover Sport", "Porsche Macan", "Changan UNI-K", "BMW Serie 4",
  "Peugeot Expert Cargo Van", "Changan CS75", "Chirey Tiggo 4", "Nissan Pathfinder", "Audi A1",
  "Isuzu ELF 100", "Volvo XC40", "Buick Enclave", "Renault Master", "Foton TM 3",
  "Chirey Tiggo 7", "Audi Q2", "Lexus RX", "Buick Envision", "JAC 6",
  "Fiat Mobi", "Toyota Sequoia", "Audi A5 Sportback", "Changan Deepal S07 REEV", "Isuzu ELF 200",
  "Hyundai Elantra", "Hyundai HB20 Hatchback", "MINI Cooper 5 puertas", "Mercedes-Benz GLB", "Volvo XC90",
  "JAC X200", "JAC E10X", "Land Rover Defender", "Mazda CX-70", "Renault Stepway",
  "Audi Q8", "Renault Koleos", "Mercedes-Benz GLA", "Mercedes-Benz CLA", "Chirey Tiggo 8",
  "Chevrolet Blazer", "Buick Encore", "Jetour Dashing", "Audi Q7", "Suzuki S-Cross",
  "Lincoln Navigator", "Infiniti QX60", "JAC Sei2", "Lexus UX", "Foton View",
  "Renault Kwid E-TECH", "Lincoln Corsair", "MG RX8", "Mercedes-Benz Clase C", "Ford E-Transit",
  "Dodge Durango", "BMW X7", "BAIC X35", "Peugeot E-Partner", "Porsche 718 Cayman",
  "Range Rover Evoque", "JMC Grand Avenue", "Mercedes-Benz Clase G", "JMC Vigus", "Jetour T1",
  "Kia Telluride", "GWM Ora 03", "Ford Edge", "Toyota GR Yaris", "MG 7",
  "MG 4", "Hyundai Palisade", "Isuzu ELF 350", "Volvo C40", "MINI Aceman",
  "MINI Cooper Electric", "Mercedes-Benz Clase E", "BAIC U5", "Mercedes-Benz GLS", "GWM Tank 500",
  "MG RX9", "Mercedes-Benz Clase A Sedán", "Chevrolet Express", "Infiniti QX50", "BMW iX1",
  "BMW iX2", "Infiniti QX80", "JAC J7", "RAM Promaster", "Jetour X70",
  "Subaru WRX", "Foton S3", "MG IM LS7", "Acura RDX", "Chevrolet Cavalier",
  "Mercedes-Benz Clase A Hatchback", "Infiniti QX55", "Lexus TX", "Mercedes-Benz CLE", "Lexus GX",
  "Audi A5", "JAC Sunray City", "Acura MDX", "Subaru BRZ", "Lexus LX",
  "JAC EX450", "Chevrolet Equinox EV", "BAIC X55", "Volkswagen e-Crafter", "Soueast S07",
  "MINI Convertible", "Jeep Wagoneer", "Geely Okavango", "Alfa Romeo Tonale", "Lincoln Aviator",
  "Cadillac XT4", "Soueast S06 i-DM", "Peugeot Landtrek", "Peugeot 5008", "Jaecoo 7",
  "Dodge Attitude", "JAC E30X", "BMW iX", "Mitsubishi Montero Sport", "DFSK E5",
  "Acura ADX", "JAC Traveler", "Jetour X70 Plus", "BMW Serie 5", "MINI Countryman E",
  "Range Rover", "Lexus ES", "Porsche 718 Boxster", "Audi Q6 e-tron", "Chirey Arrizo 8",
  "Ford Mustang Mach-E", "Audi A6", "Mercedes-Benz EQE SUV", "Range Rover Velar", "BMW i4",
  "DFSK 600", "MG ZS EV", "Mercedes-Benz Vito", "Changan Deepal S07 BEV", "Foton HI-VAN",
  "Changan CS95", "BMW Z4", "Dodge Charger", "Subaru Outback", "Chirey Tiggo 7 Pro e+",
  "Kia EV6", "JAC Sei7 Pro", "GMC Hummer EV SUV", "BMW i5", "Cadillac Optiq",
  "GMC Hummer EV Pick-up", "Chevrolet Blazer EV", "Chevrolet Corvette", "Acura Integra", "Soueast S09",
  "JAC Sei4 Pro", "Geely E22H", "Volvo EX90", "Volkswagen ID.4", "MG Cyberster",
  "Cadillac XT5", "Audi A4", "Alfa Romeo Stelvio", "JAC E J7", "BMW XM",
  "JAC e-SEI 4 Pro", "Chirey Tiggo 8 Pro e+", "Land Rover Discovery Sport", "Porsche Panamera", "JAC E Frison T8",
  "Mercedes-Benz EQB", "Geely Geometry C", "Cadillac Lyriq", "Porsche Taycan", "Mercedes-Benz SL",
  "Audi A5 Coupé", "DFSK 500", "Alfa Romeo Giulia", "Mercedes-Benz EQS SUV", "Suzuki Ciaz",
  "BMW Serie 7", "BAIC EU5", "Mercedes-Benz Clase S", "Toyota Supra", "BMW iX3",
  "Foton S3 EV", "DFSK EC35", "Mercedes-Benz EQA", "Audi A7", "Renault Mégane E-TECH",
  "Hyundai Ioniq 5", "Nissan Z", "Kia Forte", "Mercedes-AMG GT", "Lexus IS",
  "JAC Sei6 Pro", "Renault Master E-TECH", "Acura TLX", "Kia Soul", "Chevrolet Corvette Convertible",
  "Mercedes-Benz EQE", "BMW i7", "Nissan Altima", "Mercedes-Benz EQS", "Foton Wonder EV",
  "Seres 5 Max", "Renault Kangoo Z.E.", "BAIC BJ40", "Auteco E-Van S1.0T Pro", "Lexus LC",
  "JAC X250", "JAC E Sunray", "Auteco RICH 6 EV", "Audi e-tron", "Foton Miler",
  "JAC E Sei 4", "BMW Serie 8", "Mercedes-Benz EQC", "Bentley Continental", "JMC EV-Black",
  "Foton TM EV", "General Motors Brightdrop", "Audi A8", "Jaguar F-Pace", "Chevrolet Bolt EUV",
  "Auteco D2S 150", "MINI Clubman", "Foton Tunland EV", "Bentley Bentayga", "Volkswagen T-Cross",
  "Seres 5 EV", "Kia Forte Hatchback", "Fiat Ducato", "Dodge Challenger", "SEAT Tarraco",
  "Peugeot 301", "Auteco E-Truck B2.0T", "Auteco D2S 250", "Nissan GT-R", "Lexus LS",
  "JAC E X350", "Foton Hi Van EV", "Chevrolet Camaro", "Bentley Flying Spur", "Audi R8",
]

const standardPlan = [
  { name: "Cambio de aceite y filtro", km: 10000 },
  { name: "Rotación de llantas", km: 10000 },
  { name: "Filtro de aire del motor", km: 20000 },
  { name: "Filtro de aire de cabina", km: 20000 },
  { name: "Inspección de frenos", km: 20000 },
  { name: "Cambio de líquido de frenos", km: 40000 },
  { name: "Bujías de encendido", km: 50000 },
  { name: "Revisión de suspensión", km: 30000 },
  { name: "Cambio de refrigerante", km: 80000 },
]

async function seed() {
  console.log(`Iniciando ingesta de ${rawCars.length} modelos...`)

  for (const carName of rawCars) {
    const key = carName.toLowerCase()
    try {
      const { data: existing } = await supabase
        .from('MaintenanceCatalog')
        .select('key')
        .eq('key', key)
        .maybeSingle()

      if (existing) {
        await supabase
          .from('MaintenanceCatalog')
          .update({ tasksJson: JSON.stringify(standardPlan) })
          .eq('key', key)
      } else {
        await supabase
          .from('MaintenanceCatalog')
          .insert({ key, tasksJson: JSON.stringify(standardPlan) })
      }
      process.stdout.write(".")
    } catch (e) {
      console.error(`\nError insertando ${carName}:`, e)
    }
  }

  console.log("\nIngesta completada exitosamente.")
}

seed()
  .catch(e => console.error(e))
