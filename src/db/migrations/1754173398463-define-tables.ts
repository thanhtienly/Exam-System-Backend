import { MigrationInterface, QueryRunner } from "typeorm";

export class DefineTables1754173398463 implements MigrationInterface {
    name = 'DefineTables1754173398463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`role\` enum ('admin', 'teacher', 'student') NOT NULL DEFAULT 'student', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`isVerify\` tinyint NOT NULL DEFAULT 0, \`verifiedAt\` timestamp NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`courses\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`type\` enum ('public', 'private') NOT NULL DEFAULT 'public', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exams\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`timeLimit\` int NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course_exams\` (\`id\` varchar(36) NOT NULL, \`index\` int NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`examId\` varchar(255) NOT NULL, \`courseId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`questions\` (\`id\` varchar(36) NOT NULL, \`text\` text NOT NULL, \`type\` varchar(255) NOT NULL, \`index\` int NOT NULL, \`point\` float NOT NULL, \`examId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`choices\` (\`id\` varchar(36) NOT NULL, \`text\` text NOT NULL, \`index\` int NOT NULL, \`questionId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`statements\` (\`id\` varchar(36) NOT NULL, \`text\` text NOT NULL, \`index\` int NOT NULL, \`questionId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question_answers\` (\`id\` varchar(36) NOT NULL, \`answer\` varchar(255) NOT NULL, \`questionId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question_images\` (\`id\` varchar(36) NOT NULL, \`index\` int NOT NULL, \`url\` varchar(255) NOT NULL, \`questionId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`solutions\` (\`id\` varchar(36) NOT NULL, \`index\` int NOT NULL, \`text\` text NOT NULL, \`questionId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`solution_images\` (\`id\` varchar(36) NOT NULL, \`index\` int NOT NULL, \`url\` varchar(255) NOT NULL, \`solutionId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`submissions\` (\`id\` varchar(36) NOT NULL, \`startedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`endedAt\` timestamp NULL, \`score\` float NOT NULL, \`userId\` varchar(255) NOT NULL, \`courseId\` varchar(255) NOT NULL, \`examId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`submission_answers\` (\`id\` varchar(36) NOT NULL, \`mark\` int NOT NULL, \`answer\` varchar(255) NOT NULL, \`questionId\` varchar(255) NOT NULL, \`submissionId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`enrollments\` (\`id\` varchar(36) NOT NULL, \`enrolledAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` varchar(255) NOT NULL, \`courseId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`courses\` ADD CONSTRAINT \`FK_8e0ef34f8d606c64586e698abc1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`course_exams\` ADD CONSTRAINT \`FK_29a308bdbd13226abc955077242\` FOREIGN KEY (\`examId\`) REFERENCES \`exams\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`course_exams\` ADD CONSTRAINT \`FK_a428c82951a6c51f2630895f202\` FOREIGN KEY (\`courseId\`) REFERENCES \`courses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_32cd92f2cd6b9438d6425bff0b8\` FOREIGN KEY (\`examId\`) REFERENCES \`exams\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`choices\` ADD CONSTRAINT \`FK_c5164e6bff485bcfafcac9703d3\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`statements\` ADD CONSTRAINT \`FK_2c21560fe70e685b75cb7a9c87a\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question_answers\` ADD CONSTRAINT \`FK_cc2642c5e8deced1208e60ce950\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question_images\` ADD CONSTRAINT \`FK_ff54078f094e7ef1353f215021f\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`solutions\` ADD CONSTRAINT \`FK_edca376bb8a4ecf65c7b84d452b\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`solution_images\` ADD CONSTRAINT \`FK_35493b8cddf672d0975ae7076ec\` FOREIGN KEY (\`solutionId\`) REFERENCES \`solutions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`submissions\` ADD CONSTRAINT \`FK_eae888413ab8fc63cc48759d46a\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`submissions\` ADD CONSTRAINT \`FK_c02ac1ed5c479c123df59596513\` FOREIGN KEY (\`courseId\`) REFERENCES \`courses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`submissions\` ADD CONSTRAINT \`FK_f2f7f7ccde3bf5c6f70bd378a94\` FOREIGN KEY (\`examId\`) REFERENCES \`exams\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`submission_answers\` ADD CONSTRAINT \`FK_49b240a1fb2de5d9308d2125597\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`submission_answers\` ADD CONSTRAINT \`FK_7e0d6cf6173772c12089cf97474\` FOREIGN KEY (\`submissionId\`) REFERENCES \`submissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`enrollments\` ADD CONSTRAINT \`FK_de33d443c8ae36800c37c58c929\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`enrollments\` ADD CONSTRAINT \`FK_60dd0ae4e21002e63a5fdefeec8\` FOREIGN KEY (\`courseId\`) REFERENCES \`courses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`enrollments\` DROP FOREIGN KEY \`FK_60dd0ae4e21002e63a5fdefeec8\``);
        await queryRunner.query(`ALTER TABLE \`enrollments\` DROP FOREIGN KEY \`FK_de33d443c8ae36800c37c58c929\``);
        await queryRunner.query(`ALTER TABLE \`submission_answers\` DROP FOREIGN KEY \`FK_7e0d6cf6173772c12089cf97474\``);
        await queryRunner.query(`ALTER TABLE \`submission_answers\` DROP FOREIGN KEY \`FK_49b240a1fb2de5d9308d2125597\``);
        await queryRunner.query(`ALTER TABLE \`submissions\` DROP FOREIGN KEY \`FK_f2f7f7ccde3bf5c6f70bd378a94\``);
        await queryRunner.query(`ALTER TABLE \`submissions\` DROP FOREIGN KEY \`FK_c02ac1ed5c479c123df59596513\``);
        await queryRunner.query(`ALTER TABLE \`submissions\` DROP FOREIGN KEY \`FK_eae888413ab8fc63cc48759d46a\``);
        await queryRunner.query(`ALTER TABLE \`solution_images\` DROP FOREIGN KEY \`FK_35493b8cddf672d0975ae7076ec\``);
        await queryRunner.query(`ALTER TABLE \`solutions\` DROP FOREIGN KEY \`FK_edca376bb8a4ecf65c7b84d452b\``);
        await queryRunner.query(`ALTER TABLE \`question_images\` DROP FOREIGN KEY \`FK_ff54078f094e7ef1353f215021f\``);
        await queryRunner.query(`ALTER TABLE \`question_answers\` DROP FOREIGN KEY \`FK_cc2642c5e8deced1208e60ce950\``);
        await queryRunner.query(`ALTER TABLE \`statements\` DROP FOREIGN KEY \`FK_2c21560fe70e685b75cb7a9c87a\``);
        await queryRunner.query(`ALTER TABLE \`choices\` DROP FOREIGN KEY \`FK_c5164e6bff485bcfafcac9703d3\``);
        await queryRunner.query(`ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_32cd92f2cd6b9438d6425bff0b8\``);
        await queryRunner.query(`ALTER TABLE \`course_exams\` DROP FOREIGN KEY \`FK_a428c82951a6c51f2630895f202\``);
        await queryRunner.query(`ALTER TABLE \`course_exams\` DROP FOREIGN KEY \`FK_29a308bdbd13226abc955077242\``);
        await queryRunner.query(`ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_8e0ef34f8d606c64586e698abc1\``);
        await queryRunner.query(`DROP TABLE \`enrollments\``);
        await queryRunner.query(`DROP TABLE \`submission_answers\``);
        await queryRunner.query(`DROP TABLE \`submissions\``);
        await queryRunner.query(`DROP TABLE \`solution_images\``);
        await queryRunner.query(`DROP TABLE \`solutions\``);
        await queryRunner.query(`DROP TABLE \`question_images\``);
        await queryRunner.query(`DROP TABLE \`question_answers\``);
        await queryRunner.query(`DROP TABLE \`statements\``);
        await queryRunner.query(`DROP TABLE \`choices\``);
        await queryRunner.query(`DROP TABLE \`questions\``);
        await queryRunner.query(`DROP TABLE \`course_exams\``);
        await queryRunner.query(`DROP TABLE \`exams\``);
        await queryRunner.query(`DROP TABLE \`courses\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
