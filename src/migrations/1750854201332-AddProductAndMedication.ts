import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductAndMedication1750854201332 implements MigrationInterface {
    name = 'AddProductAndMedication1750854201332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`medication\` DROP FOREIGN KEY \`medication_ibfk_1\``);
        await queryRunner.query(`ALTER TABLE \`medication\` DROP FOREIGN KEY \`medication_ibfk_2\``);
        await queryRunner.query(`DROP INDEX \`IDX_f4b0d329c4a3cf79ffe9d56504\` ON \`employee\``);
        await queryRunner.query(`DROP INDEX \`IDX_901039a35ef047c20cdb4b5209\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_a7191f881489123fab6c8e5273\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_6636aefca0bdad8933c7cc3e39\` ON \`patient\``);
        await queryRunner.query(`DROP INDEX \`IDX_d4392d77e2b69109e6a105358b\` ON \`appointment\``);
        await queryRunner.query(`DROP INDEX \`prescriptionId\` ON \`medication\``);
        await queryRunner.query(`DROP INDEX \`productId\` ON \`medication\``);
        await queryRunner.query(`ALTER TABLE \`medication\` DROP COLUMN \`durationStart\``);
        await queryRunner.query(`ALTER TABLE \`medication\` ADD \`durationStart\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`medication\` DROP COLUMN \`durationEnd\``);
        await queryRunner.query(`ALTER TABLE \`medication\` ADD \`durationEnd\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`medication\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`medication\` ADD \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`medication\` CHANGE \`createdAt\` \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`medication\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`medication\` CHANGE \`prescriptionId\` \`prescriptionId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`createdAt\` \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`medication\` ADD CONSTRAINT \`FK_13fba2f48843ee8993100743a83\` FOREIGN KEY (\`prescriptionId\`) REFERENCES \`prescription\`(\`prescriptionID\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`medication\` ADD CONSTRAINT \`FK_29fdfc008edf800e7594b4f72cc\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`medication\` DROP FOREIGN KEY \`FK_29fdfc008edf800e7594b4f72cc\``);
        await queryRunner.query(`ALTER TABLE \`medication\` DROP FOREIGN KEY \`FK_13fba2f48843ee8993100743a83\``);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`updatedAt\` \`updatedAt\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`createdAt\` \`createdAt\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`medication\` CHANGE \`prescriptionId\` \`prescriptionId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`medication\` CHANGE \`updatedAt\` \`updatedAt\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`medication\` CHANGE \`createdAt\` \`createdAt\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`medication\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`medication\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`medication\` DROP COLUMN \`durationEnd\``);
        await queryRunner.query(`ALTER TABLE \`medication\` ADD \`durationEnd\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`medication\` DROP COLUMN \`durationStart\``);
        await queryRunner.query(`ALTER TABLE \`medication\` ADD \`durationStart\` date NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`productId\` ON \`medication\` (\`productId\`)`);
        await queryRunner.query(`CREATE INDEX \`prescriptionId\` ON \`medication\` (\`prescriptionId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_d4392d77e2b69109e6a105358b\` ON \`appointment\` (\`availabilityId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_6636aefca0bdad8933c7cc3e39\` ON \`patient\` (\`userId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_a7191f881489123fab6c8e5273\` ON \`users\` (\`employeeId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_901039a35ef047c20cdb4b5209\` ON \`users\` (\`patientId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_f4b0d329c4a3cf79ffe9d56504\` ON \`employee\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`medication\` ADD CONSTRAINT \`medication_ibfk_2\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`medication\` ADD CONSTRAINT \`medication_ibfk_1\` FOREIGN KEY (\`prescriptionId\`) REFERENCES \`prescription\`(\`prescriptionID\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
