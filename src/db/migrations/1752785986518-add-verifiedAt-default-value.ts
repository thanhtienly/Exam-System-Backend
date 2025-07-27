import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerifiedAtDefaultValue1752785986518 implements MigrationInterface {
    name = 'AddVerifiedAtDefaultValue1752785986518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`createdAt\` \`createdAt\` date NOT NULL DEFAULT (CURRENT_DATE)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`createdAt\` \`createdAt\` date NOT NULL DEFAULT 'curdate()'`);
    }

}
