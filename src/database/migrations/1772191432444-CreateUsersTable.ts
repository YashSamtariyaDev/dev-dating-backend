import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1772191432444 implements MigrationInterface {
    name = 'CreateUsersTable1772191432444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`profiles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`bio\` varchar(255) NULL, \`gender\` enum ('male', 'female', 'other') NULL, \`lookingFor\` varchar(255) NULL, \`techStack\` json NULL, \`experienceLevel\` enum ('junior', 'mid', 'senior') NULL, \`githubUrl\` varchar(255) NULL, \`linkedinUrl\` varchar(255) NULL, \`location\` varchar(255) NULL, \`isComplete\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, UNIQUE INDEX \`REL_315ecd98bd1a42dcf2ec4e2e98\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`isEmailVerified\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`role\` enum ('user', 'admin', 'super_admin') NOT NULL DEFAULT 'user', UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_actions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`action\` enum ('LIKE', 'DISLIKE') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`fromUserId\` int NULL, \`toUserId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`swipes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('LIKE', 'PASS', 'SUPER_LIKE') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`swiperId\` int NULL, \`targetId\` int NULL, INDEX \`IDX_140ec6486a3c6a38e8970d1006\` (\`swiperId\`), INDEX \`IDX_e99d463fb60cc745acb10fd496\` (\`targetId\`), UNIQUE INDEX \`IDX_1d8d550884a1af4c6bf0c4906d\` (\`swiperId\`, \`targetId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`matches\` (\`id\` int NOT NULL AUTO_INCREMENT, \`matchedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`isActive\` tinyint NOT NULL DEFAULT 1, \`user1Id\` int NULL, \`user2Id\` int NULL, INDEX \`IDX_490a012c8f323d6f56a9eaf400\` (\`user1Id\`), INDEX \`IDX_171f004c4484d7dc93919cdf43\` (\`user2Id\`), UNIQUE INDEX \`IDX_b235a0f59316b4e05be595c919\` (\`user1Id\`, \`user2Id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`profiles\` ADD CONSTRAINT \`FK_315ecd98bd1a42dcf2ec4e2e985\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_actions\` ADD CONSTRAINT \`FK_06ab9b0962953e1ba02e1fe1d34\` FOREIGN KEY (\`fromUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_actions\` ADD CONSTRAINT \`FK_a028dd68ed39a71dd61b35a1ddf\` FOREIGN KEY (\`toUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`swipes\` ADD CONSTRAINT \`FK_140ec6486a3c6a38e8970d10066\` FOREIGN KEY (\`swiperId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`swipes\` ADD CONSTRAINT \`FK_e99d463fb60cc745acb10fd4962\` FOREIGN KEY (\`targetId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_490a012c8f323d6f56a9eaf4008\` FOREIGN KEY (\`user1Id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_171f004c4484d7dc93919cdf439\` FOREIGN KEY (\`user2Id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_171f004c4484d7dc93919cdf439\``);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_490a012c8f323d6f56a9eaf4008\``);
        await queryRunner.query(`ALTER TABLE \`swipes\` DROP FOREIGN KEY \`FK_e99d463fb60cc745acb10fd4962\``);
        await queryRunner.query(`ALTER TABLE \`swipes\` DROP FOREIGN KEY \`FK_140ec6486a3c6a38e8970d10066\``);
        await queryRunner.query(`ALTER TABLE \`user_actions\` DROP FOREIGN KEY \`FK_a028dd68ed39a71dd61b35a1ddf\``);
        await queryRunner.query(`ALTER TABLE \`user_actions\` DROP FOREIGN KEY \`FK_06ab9b0962953e1ba02e1fe1d34\``);
        await queryRunner.query(`ALTER TABLE \`profiles\` DROP FOREIGN KEY \`FK_315ecd98bd1a42dcf2ec4e2e985\``);
        await queryRunner.query(`DROP INDEX \`IDX_b235a0f59316b4e05be595c919\` ON \`matches\``);
        await queryRunner.query(`DROP INDEX \`IDX_171f004c4484d7dc93919cdf43\` ON \`matches\``);
        await queryRunner.query(`DROP INDEX \`IDX_490a012c8f323d6f56a9eaf400\` ON \`matches\``);
        await queryRunner.query(`DROP TABLE \`matches\``);
        await queryRunner.query(`DROP INDEX \`IDX_1d8d550884a1af4c6bf0c4906d\` ON \`swipes\``);
        await queryRunner.query(`DROP INDEX \`IDX_e99d463fb60cc745acb10fd496\` ON \`swipes\``);
        await queryRunner.query(`DROP INDEX \`IDX_140ec6486a3c6a38e8970d1006\` ON \`swipes\``);
        await queryRunner.query(`DROP TABLE \`swipes\``);
        await queryRunner.query(`DROP TABLE \`user_actions\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_315ecd98bd1a42dcf2ec4e2e98\` ON \`profiles\``);
        await queryRunner.query(`DROP TABLE \`profiles\``);
    }

}
