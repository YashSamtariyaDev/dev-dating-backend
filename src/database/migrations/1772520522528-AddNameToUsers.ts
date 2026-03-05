import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToUsers1772520522528 implements MigrationInterface {
    name = 'AddNameToUsers1772520522528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`name\` varchar(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`name\``);
    }

}
