import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1750523968456 implements MigrationInterface {
    name = 'InitSchema1750523968456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_f4b0d329c4a3cf79ffe9d56504\` ON \`employee\``);
        await queryRunner.query(`DROP INDEX \`IDX_6636aefca0bdad8933c7cc3e39\` ON \`patient\``);
        await queryRunner.query(`DROP INDEX \`IDX_d4392d77e2b69109e6a105358b\` ON \`appointment\``);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD UNIQUE INDEX \`IDX_f4b0d329c4a3cf79ffe9d56504\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`patient\` ADD UNIQUE INDEX \`IDX_6636aefca0bdad8933c7cc3e39\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD UNIQUE INDEX \`IDX_d4392d77e2b69109e6a105358b\` (\`availabilityId\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_a000cca60bcf04454e72769949\` (\`phone\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`isActive\` \`isActive\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`isEmailVerified\` \`isEmailVerified\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`isPhoneVerified\` \`isPhoneVerified\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`createdAt\` \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`updatedAt\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`deletedAt\` \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_901039a35ef047c20cdb4b5209\` (\`patientId\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_a7191f881489123fab6c8e5273\` (\`employeeId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_f4b0d329c4a3cf79ffe9d56504\` ON \`employee\` (\`userId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_6636aefca0bdad8933c7cc3e39\` ON \`patient\` (\`userId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_d4392d77e2b69109e6a105358b\` ON \`appointment\` (\`availabilityId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_901039a35ef047c20cdb4b5209\` ON \`users\` (\`patientId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_a7191f881489123fab6c8e5273\` ON \`users\` (\`employeeId\`)`);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_f4b0d329c4a3cf79ffe9d565047\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`empAvailability\` ADD CONSTRAINT \`FK_ca560465b6c4fbd93e081439481\` FOREIGN KEY (\`empId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`prescription\` ADD CONSTRAINT \`FK_d9d1ecabc97e4de5c07a1795279\` FOREIGN KEY (\`patientId\`) REFERENCES \`patient\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`prescription\` ADD CONSTRAINT \`FK_b607fd68642928ac7e705db6fe6\` FOREIGN KEY (\`doctorDoctorID\`) REFERENCES \`doctor\`(\`doctorID\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`prescription\` ADD CONSTRAINT \`FK_dc8fccc24187a36f2fe02aec356\` FOREIGN KEY (\`hospitalHospitalID\`) REFERENCES \`hospital\`(\`hospitalID\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`patient\` ADD CONSTRAINT \`FK_6636aefca0bdad8933c7cc3e394\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD CONSTRAINT \`FK_7d50846cbac0816ad41648c27ad\` FOREIGN KEY (\`empId\`) REFERENCES \`employee\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD CONSTRAINT \`FK_5ce4c3130796367c93cd817948e\` FOREIGN KEY (\`patientId\`) REFERENCES \`patient\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD CONSTRAINT \`FK_d4392d77e2b69109e6a105358b9\` FOREIGN KEY (\`availabilityId\`) REFERENCES \`empAvailability\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_901039a35ef047c20cdb4b52092\` FOREIGN KEY (\`patientId\`) REFERENCES \`patient\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_a7191f881489123fab6c8e52738\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_a7191f881489123fab6c8e52738\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_901039a35ef047c20cdb4b52092\``);
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP FOREIGN KEY \`FK_d4392d77e2b69109e6a105358b9\``);
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP FOREIGN KEY \`FK_5ce4c3130796367c93cd817948e\``);
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP FOREIGN KEY \`FK_7d50846cbac0816ad41648c27ad\``);
        await queryRunner.query(`ALTER TABLE \`patient\` DROP FOREIGN KEY \`FK_6636aefca0bdad8933c7cc3e394\``);
        await queryRunner.query(`ALTER TABLE \`prescription\` DROP FOREIGN KEY \`FK_dc8fccc24187a36f2fe02aec356\``);
        await queryRunner.query(`ALTER TABLE \`prescription\` DROP FOREIGN KEY \`FK_b607fd68642928ac7e705db6fe6\``);
        await queryRunner.query(`ALTER TABLE \`prescription\` DROP FOREIGN KEY \`FK_d9d1ecabc97e4de5c07a1795279\``);
        await queryRunner.query(`ALTER TABLE \`empAvailability\` DROP FOREIGN KEY \`FK_ca560465b6c4fbd93e081439481\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_f4b0d329c4a3cf79ffe9d565047\``);
        await queryRunner.query(`DROP INDEX \`REL_a7191f881489123fab6c8e5273\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_901039a35ef047c20cdb4b5209\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_d4392d77e2b69109e6a105358b\` ON \`appointment\``);
        await queryRunner.query(`DROP INDEX \`REL_6636aefca0bdad8933c7cc3e39\` ON \`patient\``);
        await queryRunner.query(`DROP INDEX \`REL_f4b0d329c4a3cf79ffe9d56504\` ON \`employee\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_a7191f881489123fab6c8e5273\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_901039a35ef047c20cdb4b5209\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`deletedAt\` \`deletedAt\` datetime(0) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`updatedAt\` \`updatedAt\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`createdAt\` \`createdAt\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`isPhoneVerified\` \`isPhoneVerified\` tinyint(1) NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`isEmailVerified\` \`isEmailVerified\` tinyint(1) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`isActive\` \`isActive\` tinyint(1) NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_a000cca60bcf04454e72769949\``);
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP INDEX \`IDX_d4392d77e2b69109e6a105358b\``);
        await queryRunner.query(`ALTER TABLE \`patient\` DROP INDEX \`IDX_6636aefca0bdad8933c7cc3e39\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP INDEX \`IDX_f4b0d329c4a3cf79ffe9d56504\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_d4392d77e2b69109e6a105358b\` ON \`appointment\` (\`availabilityId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_6636aefca0bdad8933c7cc3e39\` ON \`patient\` (\`userId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_f4b0d329c4a3cf79ffe9d56504\` ON \`employee\` (\`userId\`)`);
    }

}
