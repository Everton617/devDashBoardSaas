/*
  Warnings:

  - You are about to drop the column `pedido` on the `Order` table. All the data in the column will be lost.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `cep` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `complemento` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instrucoes` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metodo_pag` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rua` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tel` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('BACKLOG', 'ANDAMENTO', 'ENTREGA', 'CONCLUIDO');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "pedido",
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "complemento" TEXT NOT NULL,
ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "instrucoes" TEXT NOT NULL,
ADD COLUMN     "metodo_pag" TEXT NOT NULL,
ADD COLUMN     "numero" TEXT NOT NULL,
ADD COLUMN     "rua" TEXT NOT NULL,
ADD COLUMN     "teamId" TEXT NOT NULL,
ADD COLUMN     "tel" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'BACKLOG';

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "instrucoes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_code_key" ON "Item"("code");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
