export interface SimplifiedCar {
  id: string;
  model: string;
  brand: string;
  year: number;
  imageUrl: string | null;
  licensePlate: string | null;
}

export interface CatalogCar {
  id: string;
  year: number;
  model: {
    name: string;
    brand: {
      name: string;
    };
  };
}

export interface UserSessionData {
  id: string;
  email: string;
  plan: string;
}

export interface DashboardData {
  user: UserSessionData;
  activeCar: any; // Mantener como any temporalmente hasta que se definan todas las relaciones
  cars: SimplifiedCar[];
  activeCarId: string | null;
  catalogCars: CatalogCar[];
}
