-- DropForeignKey
ALTER TABLE "CosasTraidas" DROP CONSTRAINT "CosasTraidas_idUsuario_fkey";

-- AlterTable
ALTER TABLE "CosasTraer" ALTER COLUMN "nombreObjeto" DROP NOT NULL,
ALTER COLUMN "cantidad" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CosasTraidas" ALTER COLUMN "nombreObjeto" DROP NOT NULL,
ALTER COLUMN "cantidad" DROP NOT NULL,
ALTER COLUMN "idUsuario" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CosasTraidas" ADD CONSTRAINT "CosasTraidas_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
