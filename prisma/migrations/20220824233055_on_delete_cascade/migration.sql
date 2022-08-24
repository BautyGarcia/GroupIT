-- DropForeignKey
ALTER TABLE "CosasTraer" DROP CONSTRAINT "CosasTraer_idEvento_fkey";

-- DropForeignKey
ALTER TABLE "CosasTraidas" DROP CONSTRAINT "CosasTraidas_idEvento_fkey";

-- DropForeignKey
ALTER TABLE "CosasTraidas" DROP CONSTRAINT "CosasTraidas_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "Eventos" DROP CONSTRAINT "Eventos_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "EventosProveedor" DROP CONSTRAINT "EventosProveedor_idEvento_fkey";

-- DropForeignKey
ALTER TABLE "EventosProveedor" DROP CONSTRAINT "EventosProveedor_idProveedor_fkey";

-- DropForeignKey
ALTER TABLE "Proveedores" DROP CONSTRAINT "Proveedores_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioEventos" DROP CONSTRAINT "UsuarioEventos_idEvento_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioEventos" DROP CONSTRAINT "UsuarioEventos_idUsuario_fkey";

-- AddForeignKey
ALTER TABLE "Eventos" ADD CONSTRAINT "Eventos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proveedores" ADD CONSTRAINT "Proveedores_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioEventos" ADD CONSTRAINT "UsuarioEventos_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "Eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioEventos" ADD CONSTRAINT "UsuarioEventos_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventosProveedor" ADD CONSTRAINT "EventosProveedor_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "Eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventosProveedor" ADD CONSTRAINT "EventosProveedor_idProveedor_fkey" FOREIGN KEY ("idProveedor") REFERENCES "Proveedores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CosasTraer" ADD CONSTRAINT "CosasTraer_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "Eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CosasTraidas" ADD CONSTRAINT "CosasTraidas_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "Eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CosasTraidas" ADD CONSTRAINT "CosasTraidas_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
