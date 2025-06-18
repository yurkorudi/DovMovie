-- CreateTable
CREATE TABLE `MovieHeader` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `titleEng` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NOT NULL,
    `subtitleEng` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `addressEng` VARCHAR(191) NOT NULL,
    `contactsPhone` VARCHAR(191) NOT NULL,
    `contactTitle` VARCHAR(191) NOT NULL,
    `contactTitleEng` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MovieHeader` ADD CONSTRAINT `MovieHeader_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
