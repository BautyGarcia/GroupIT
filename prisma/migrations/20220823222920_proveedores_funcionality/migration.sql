/*
  Warnings:

  - Added the required column `usuarioId` to the `Proveedores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proveedores" ADD COLUMN     "usuarioId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Proveedores" ADD CONSTRAINT "Proveedores_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
