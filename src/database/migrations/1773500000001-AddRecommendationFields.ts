import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRecommendationFields1773500000001 implements MigrationInterface {
  name = 'AddRecommendationFields1773500000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`profiles\` 
      ADD COLUMN \`dateOfBirth\` date NULL,
      ADD COLUMN \`age\` int NULL,
      ADD COLUMN \`minAge\` int NULL,
      ADD COLUMN \`maxAge\` int NULL,
      ADD COLUMN \`maxDistance\` int NULL,
      ADD COLUMN \`latitude\` decimal(10,8) NULL,
      ADD COLUMN \`longitude\` decimal(11,8) NULL
    `);

    await queryRunner.query(`
      ALTER TABLE \`profiles\` 
      MODIFY COLUMN \`lookingFor\` enum('male','female','both') NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`profiles\` 
      DROP COLUMN \`dateOfBirth\`,
      DROP COLUMN \`age\`,
      DROP COLUMN \`minAge\`,
      DROP COLUMN \`maxAge\`,
      DROP COLUMN \`maxDistance\`,
      DROP COLUMN \`latitude\`,
      DROP COLUMN \`longitude\`
    `);

    await queryRunner.query(`
      ALTER TABLE \`profiles\` 
      MODIFY COLUMN \`lookingFor\` varchar(255) NULL
    `);
  }
}
