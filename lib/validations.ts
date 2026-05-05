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
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  currentKm: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo."),
  lastServiceKm: z.coerce.number().int().optional(),
});

export const UpdateMileageSchema = z.object({
  userCarId: z.string().min(1, "ID de vehículo inválido."),
  newKm: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo."),
});

export const EditVehicleSchema = z.object({
  userCarId: z.string().min(1, "ID de vehículo inválido."),
  color: z.string().optional(),
});

export const AddCustomServiceSchema = z.object({
  userCarId: z.string().min(1, "ID de vehículo inválido."),
  customName: z.string().min(2, "El nombre del servicio debe tener al menos 2 caracteres."),
  kmAtService: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo."),
  cost: z.coerce.number().min(0, "El costo no puede ser negativo.").optional().default(0),
  date: z.string().optional(),
  notes: z.string().optional(),
});

export const ReminderSchema = z.object({
  userCarId: z.string().min(1, "ID de vehículo inválido."),
  title: z.string().min(2, "El título debe tener al menos 2 caracteres."),
  date: z.string().min(1, "La fecha es requerida."),
  detail: z.string().optional(),
});

export const EditServiceSchema = z.object({
  serviceId: z.string().min(1, "ID de servicio inválido."),
  customName: z.string().min(2, "El nombre del servicio debe tener al menos 2 caracteres."),
  kmAtService: z.coerce.number().int().min(0, "El kilometraje no puede ser negativo."),
  cost: z.coerce.number().min(0, "El costo no puede ser negativo.").optional().default(0),
  date: z.string().optional(),
  notes: z.string().optional(),
});

export const AddMaintenanceTaskSchema = z.object({
  userCarId: z.string().min(1, "ID de vehículo inválido."),
  name: z.string().min(2, "El nombre de la tarea debe tener al menos 2 caracteres."),
  frequencyKm: z.coerce.number().int().min(1000, "La frecuencia mínima es de 1,000 km."),
});

