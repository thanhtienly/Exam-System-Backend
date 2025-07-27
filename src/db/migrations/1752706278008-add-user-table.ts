import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTable1752706278008 implements MigrationInterface {
    name = 'AddUserTable1752706278008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`role\` enum ('admin', 'teacher', 'student') NOT NULL DEFAULT 'student', \`createdAt\` date NOT NULL DEFAULT (CURRENT_DATE), \`isVerify\` tinyint NOT NULL DEFAULT 0, \`verifiedAt\` date NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
