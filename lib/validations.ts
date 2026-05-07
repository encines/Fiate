import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Correo electrónico inválido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export const LoginSchema = z.object({
  email: z.string().email("Correo electrónico inválido."),
  password: z.string().min(1, "La contraseña es requerida."),
});

export const AddVehicleSchema = z.object({
  brand: z.string().min(1, "La marca es requerida."),
  model: z.string().min(1, "El modelo es requerido."),
  year: z.coerce.number().int()
    .min(1900, "El año debe ser mayor a 1900.")
    .max(new Date().getFullYear() + 1, "El año no es válido."),
  currentKm: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo."),
  lastServiceKm: z.coerce.number().int().min(0).optional(),
});

export const UpdateMileageSchema = z.object({
  userCarId: z.string().min(1, "ID de vehículo inválido."),
  newKm: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo."),
});

export const EditVehicleSchema = z.object({
  userCarId: z.string().min(1, "ID de vehículo inválido."),
  color: z.string().max(30, "El color es demasiado largo.").optional(),
  brand: z.string().min(1, "La marca es requerida.").optional(),
  model: z.string().min(1, "El modelo es requerido.").optional(),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  licensePlate: z.string().max(20, "La placa es demasiado larga.").optional(),
  imageUrl: z.string().optional(),
});

export const AddCustomServiceSchema = z.object({
  userCarId: z.string().min(1, "ID de vehículo inválido."),
  customName: z.string().min(2, "El nombre del servicio debe tener al menos 2 caracteres."),
  kmAtService: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo."),
  cost: z.coerce.number().min(0, "El costo no puede ser negativo.").optional().default(0),
  date: z.coerce.date().max(new Date(), "La fecha no puede ser futura.").optional().default(() => new Date()),
  notes: z.string().max(500, "Las notas no pueden exceder los 500 caracteres.").optional(),
});

export const ReminderSchema = z.object({
  userCarId: z.string().min(1, "ID de vehículo inválido."),
  title: z.string().min(2, "El título debe tener al menos 2 caracteres."),
  date: z.coerce.date().min(new Date(), "El recordatorio debe ser para una fecha futura."),
  detail: z.string().max(200, "El detalle es demasiado largo.").optional(),
});

export const EditServiceSchema = z.object({
  serviceId: z.string().min(1, "ID de servicio inválido."),
  customName: z.string().min(2, "El nombre del servicio debe tener al menos 2 caracteres."),
  kmAtService: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo."),
  cost: z.coerce.number().min(0, "El costo no puede ser negativo.").optional().default(0),
  date: z.coerce.date().max(new Date(), "La fecha no puede ser futura.").optional(),
  notes: z.string().max(500, "Las notas no pueden exceder los 500 caracteres.").optional(),
});

export const AddMaintenanceTaskSchema = z.object({
  userCarId: z.string().min(1, "ID de vehículo inválido."),
  name: z.string().min(2, "El nombre de la tarea debe tener al menos 2 caracteres."),
  frequencyKm: z.coerce.number().int().min(100, "La frecuencia mínima es de 100 km."),
});

export const FuelLogSchema = z.object({
  userCarId: z.string().min(1, "ID de vehículo inválido."),
  km: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo."),
  liters: z.coerce.number().positive("Los litros deben ser un número positivo."),
  cost: z.coerce.number().min(0, "El costo no puede ser negativo."),
  date: z.coerce.date().max(new Date(), "La fecha no puede ser futura.").default(() => new Date()),
});

export const DocumentSchema = z.object({
  userCarId: z.string().min(1, "ID de vehículo inválido."),
  name: z.string().min(2, "El nombre del documento es requerido."),
  type: z.string().min(1, "El tipo es requerido."),
  expiryDate: z.coerce.date().optional(),
});

