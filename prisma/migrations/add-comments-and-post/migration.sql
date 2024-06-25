-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "cep",
DROP COLUMN "cidade",
DROP COLUMN "complemento",
DROP COLUMN "estado",
DROP COLUMN "instrucoes",
DROP COLUMN "metodo_pag",
DROP COLUMN "numero",
DROP COLUMN "rua",
DROP COLUMN "tel",
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "managedBy" TEXT NOT NULL,
ADD COLUMN     "pedido" TEXT NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "userId" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "jackson_store" ALTER COLUMN "namespace" SET DATA TYPE VARCHAR(256);

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "OrderItem";

-- DropEnum
DROP TYPE "OrderStatus";

-- RenameForeignKey
ALTER TABLE "jackson_index" RENAME CONSTRAINT "jackson_index_storeKey_fkey" TO "FK_937b040fb2592b4671cbde09e83";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

