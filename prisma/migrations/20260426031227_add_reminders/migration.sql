-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "detail" TEXT,
    "userCarId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reminder_userCarId_fkey" FOREIGN KEY ("userCarId") REFERENCES "UserCar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
