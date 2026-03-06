import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChatTables1772791867663 implements MigrationInterface {
    name = 'CreateChatTables1772791867663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_171f004c4484d7dc93919cdf439\``);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_490a012c8f323d6f56a9eaf4008\``);
        await queryRunner.query(`DROP INDEX \`IDX_171f004c4484d7dc93919cdf43\` ON \`matches\``);
        await queryRunner.query(`DROP INDEX \`IDX_490a012c8f323d6f56a9eaf400\` ON \`matches\``);
        await queryRunner.query(`CREATE TABLE \`chat_rooms\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`match_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`message\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`chat_room_id\` int NULL, \`sender_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_490a012c8f323d6f56a9eaf4008\` FOREIGN KEY (\`user1Id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_171f004c4484d7dc93919cdf439\` FOREIGN KEY (\`user2Id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` ADD CONSTRAINT \`FK_6c4767fc3566a99df37b4f5d2b4\` FOREIGN KEY (\`match_id\`) REFERENCES \`matches\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_5bb8108b85199f4ae096599917f\` FOREIGN KEY (\`chat_room_id\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_22133395bd13b970ccd0c34ab22\` FOREIGN KEY (\`sender_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_22133395bd13b970ccd0c34ab22\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_5bb8108b85199f4ae096599917f\``);
        await queryRunner.query(`ALTER TABLE \`chat_rooms\` DROP FOREIGN KEY \`FK_6c4767fc3566a99df37b4f5d2b4\``);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_171f004c4484d7dc93919cdf439\``);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_490a012c8f323d6f56a9eaf4008\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
        await queryRunner.query(`DROP TABLE \`chat_rooms\``);
        await queryRunner.query(`CREATE INDEX \`IDX_490a012c8f323d6f56a9eaf400\` ON \`matches\` (\`user1Id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_171f004c4484d7dc93919cdf43\` ON \`matches\` (\`user2Id\`)`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_490a012c8f323d6f56a9eaf4008\` FOREIGN KEY (\`user1Id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_171f004c4484d7dc93919cdf439\` FOREIGN KEY (\`user2Id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
