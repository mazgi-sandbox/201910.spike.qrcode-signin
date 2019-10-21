import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1571548807824 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `user` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `displayName` varchar(255) NOT NULL, `hashedPassword` varchar(255) NULL, UNIQUE INDEX `IDX_065d4d8f3b5adb4a08841eae3c` (`name`), UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), UNIQUE INDEX `IDX_059e69c318702e93998f26d152` (`displayName`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `sign_in_token` (`id` varchar(36) NOT NULL, `userId` varchar(255) NOT NULL, `encryptedPassphrase` varchar(255) NULL, `expiresAt` datetime NOT NULL, INDEX `IDX_01d8935f4e8899ca7467ff29fd` (`userId`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `user_group` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `displayName` varchar(255) NOT NULL, UNIQUE INDEX `IDX_11b85d8d72220e3ca816d3e907` (`name`), UNIQUE INDEX `IDX_65ee65d199c541b233a308d41f` (`displayName`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_65ee65d199c541b233a308d41f` ON `user_group`", undefined);
        await queryRunner.query("DROP INDEX `IDX_11b85d8d72220e3ca816d3e907` ON `user_group`", undefined);
        await queryRunner.query("DROP TABLE `user_group`", undefined);
        await queryRunner.query("DROP INDEX `IDX_01d8935f4e8899ca7467ff29fd` ON `sign_in_token`", undefined);
        await queryRunner.query("DROP TABLE `sign_in_token`", undefined);
        await queryRunner.query("DROP INDEX `IDX_059e69c318702e93998f26d152` ON `user`", undefined);
        await queryRunner.query("DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`", undefined);
        await queryRunner.query("DROP INDEX `IDX_065d4d8f3b5adb4a08841eae3c` ON `user`", undefined);
        await queryRunner.query("DROP TABLE `user`", undefined);
    }

}
