/*
  Warnings:

  - You are about to drop the column `passoword` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[password]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Usuario_passoword_key";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "passoword",
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_password_key" ON "Usuario"("password");
