import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserActions1769000271176 implements MigrationInterface {
    name = 'CreateUserActions1769000271176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_actions\` (\`id\` varchar(36) NOT NULL, \`action\` enum ('LIKE', 'DISLIKE') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`fromUserId\` varchar(36) NULL, \`toUserId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_actions\` ADD CONSTRAINT \`FK_06ab9b0962953e1ba02e1fe1d34\` FOREIGN KEY (\`fromUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_actions\` ADD CONSTRAINT \`FK_a028dd68ed39a71dd61b35a1ddf\` FOREIGN KEY (\`toUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_actions\` DROP FOREIGN KEY \`FK_a028dd68ed39a71dd61b35a1ddf\``);
        await queryRunner.query(`ALTER TABLE \`user_actions\` DROP FOREIGN KEY \`FK_06ab9b0962953e1ba02e1fe1d34\``);
        await queryRunner.query(`DROP TABLE \`user_actions\``);
    }

}
