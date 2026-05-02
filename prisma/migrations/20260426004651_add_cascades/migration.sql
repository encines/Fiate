-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ServiceHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "cost" REAL,
    "kmAtService" INTEGER NOT NULL,
    "userCarId" TEXT NOT NULL,
    "taskId" TEXT,
    CONSTRAINT "ServiceHistory_userCarId_fkey" FOREIGN KEY ("userCarId") REFERENCES "UserCar" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ServiceHistory_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "MaintenanceTask" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ServiceHistory" ("cost", "date", "id", "kmAtService", "taskId", "userCarId") SELECT "cost", "date", "id", "kmAtService", "taskId", "userCarId" FROM "ServiceHistory";
DROP TABLE "ServiceHistory";
ALTER TABLE "new_ServiceHistory" RENAME TO "ServiceHistory";
CREATE TABLE "new_UserCar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "catalogCarId" TEXT NOT NULL,
    "color" TEXT,
    "licensePlate" TEXT,
    "vin" TEXT,
    "currentKm" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "UserCar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserCar_catalogCarId_fkey" FOREIGN KEY ("catalogCarId") REFERENCES "CatalogCar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserCar" ("catalogCarId", "color", "currentKm", "id", "licensePlate", "userId", "vin") SELECT "catalogCarId", "color", "currentKm", "id", "licensePlate", "userId", "vin" FROM "UserCar";
DROP TABLE "UserCar";
ALTER TABLE "new_UserCar" RENAME TO "UserCar";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
