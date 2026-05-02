"use client";

import { useTransition } from "react";
import { setActiveCar } from "../actions/setActiveCar";

interface CarSelectorProps {
  cars: {
    id: string;
    model: string;
    brand: string;
    year: number;
  }[];
  activeCarId: string | null;
}

export default function CarSelector({ cars, activeCarId }: CarSelectorProps) {
  const [isPending, startTransition] = useTransition();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const carId = e.target.value;
    startTransition(async () => {
      await setActiveCar(carId);
    });
  };

  if (cars.length <= 1 && !activeCarId) return null;

  return (
    <div className="mt-4 px-2">
      <label htmlFor="car-select" className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 px-2">
        Garaje / Auto Activo
      </label>
      <div className="relative group">
        <select
          id="car-select"
          value={activeCarId || cars[0]?.id}
          onChange={handleSelect}
          disabled={isPending}
          className="w-full appearance-none rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm font-medium text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-all cursor-pointer hover:border-zinc-600"
        >
          {cars.map((car) => (
            <option key={car.id} value={car.id} className="bg-zinc-900 text-white">
              {car.brand} {car.model} ({car.year})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 group-hover:text-zinc-200">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {isPending && (
        <div className="mt-1 px-2 text-[10px] text-indigo-400 animate-pulse">
          Cambiando vehículo...
        </div>
      )}
    </div>
  );
}
