/*
  Warnings:

  - You are about to drop the column `teamId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `entregador` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horario` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pedido` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_teamId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "teamId",
ADD COLUMN     "entregador" TEXT NOT NULL,
ADD COLUMN     "horario" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pedido" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- DropEnum
DROP TYPE "OrderStatus";
