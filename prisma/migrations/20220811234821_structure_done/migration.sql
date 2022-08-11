-- CreateEnum
CREATE TYPE "TipoServicio" AS ENUM ('Undefined', 'Catering', 'Muebles', 'Organizacion', 'Entretenimiento', 'EntretenimientoInfantil', 'Otros');

-- CreateTable
CREATE TABLE "Eventos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "lugar" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedores" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipoServicio" "TipoServicio" NOT NULL DEFAULT 'Undefined',
    "personasMinimas" INTEGER NOT NULL,
    "precio" INTEGER NOT NULL,
    "contacto" TEXT NOT NULL,

    CONSTRAINT "Proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioEventos" (
    "id" TEXT NOT NULL,
    "confirmacion" BOOLEAN NOT NULL,
    "idUsuario" TEXT NOT NULL,
    "idEvento" TEXT NOT NULL,

    CONSTRAINT "UsuarioEventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventosProveedor" (
    "id" TEXT NOT NULL,
    "idEvento" TEXT NOT NULL,
    "idProveedor" TEXT NOT NULL,

    CONSTRAINT "EventosProveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CosasTraer" (
    "id" TEXT NOT NULL,
    "nombreObjeto" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "idEvento" TEXT NOT NULL,

    CONSTRAINT "CosasTraer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CosasTraidas" (
    "id" TEXT NOT NULL,
    "nombreObjeto" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "idEvento" TEXT NOT NULL,
    "idUsuario" TEXT NOT NULL,

    CONSTRAINT "CosasTraidas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Eventos_nombre_key" ON "Eventos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedores_nombre_key" ON "Proveedores"("nombre");

-- AddForeignKey
ALTER TABLE "Eventos" ADD CONSTRAINT "Eventos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioEventos" ADD CONSTRAINT "UsuarioEventos_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioEventos" ADD CONSTRAINT "UsuarioEventos_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "Eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventosProveedor" ADD CONSTRAINT "EventosProveedor_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "Eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventosProveedor" ADD CONSTRAINT "EventosProveedor_idProveedor_fkey" FOREIGN KEY ("idProveedor") REFERENCES "Proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CosasTraer" ADD CONSTRAINT "CosasTraer_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "Eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CosasTraidas" ADD CONSTRAINT "CosasTraidas_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "Eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CosasTraidas" ADD CONSTRAINT "CosasTraidas_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
