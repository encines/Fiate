"use client";

import { useTransition } from "react";
import { setActiveCar } from "../actions/setActiveCar";

import { SimplifiedCar } from "../../lib/types";

interface CarSelectorProps {
  cars: SimplifiedCar[];
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

  return (
    <div className="mt-4 px-2">
      <label htmlFor="car-select" className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 px-2">
        Garaje / Auto Activo
      </label>
      <div className="relative group">
        <select
          id="car-select"
          value={activeCarId || (cars.length > 0 ? cars[0].id : "")}
          onChange={handleSelect}
          disabled={isPending || cars.length === 0}
          className="w-full appearance-none rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-100 dark:bg-zinc-950/60 px-4 py-2.5 text-sm font-medium text-zinc-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-all cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600"
        >
          {cars.length === 0 ? (
            <option value="" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
              No hay vehículos
            </option>
          ) : (
            cars.map((car) => (
              <option key={car.id} value={car.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                {car.brand} {car.model} ({car.year})
              </option>
            ))
          )}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
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
