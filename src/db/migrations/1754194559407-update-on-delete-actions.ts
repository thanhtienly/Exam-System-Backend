import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOnDeleteActions1754194559407 implements MigrationInterface {
    name = 'UpdateOnDeleteActions1754194559407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_29a308bdbd13226abc955077242\` ON \`course_exams\``);
        await queryRunner.query(`DROP INDEX \`FK_a428c82951a6c51f2630895f202\` ON \`course_exams\``);
        await queryRunner.query(`DROP INDEX \`FK_32cd92f2cd6b9438d6425bff0b8\` ON \`questions\``);
        await queryRunner.query(`DROP INDEX \`FK_c5164e6bff485bcfafcac9703d3\` ON \`choices\``);
        await queryRunner.query(`DROP INDEX \`FK_2c21560fe70e685b75cb7a9c87a\` ON \`statements\``);
        await queryRunner.query(`DROP INDEX \`FK_cc2642c5e8deced1208e60ce950\` ON \`question_answers\``);
        await queryRunner.query(`DROP INDEX \`FK_ff54078f094e7ef1353f215021f\` ON \`question_images\``);
        await queryRunner.query(`DROP INDEX \`FK_edca376bb8a4ecf65c7b84d452b\` ON \`solutions\``);
        await queryRunner.query(`DROP INDEX \`FK_35493b8cddf672d0975ae7076ec\` ON \`solution_images\``);
        await queryRunner.query(`DROP INDEX \`FK_c02ac1ed5c479c123df59596513\` ON \`submissions\``);
        await queryRunner.query(`DROP INDEX \`FK_eae888413ab8fc63cc48759d46a\` ON \`submissions\``);
        await queryRunner.query(`DROP INDEX \`FK_f2f7f7ccde3bf5c6f70bd378a94\` ON \`submissions\``);
        await queryRunner.query(`DROP INDEX \`FK_49b240a1fb2de5d9308d2125597\` ON \`submission_answers\``);
        await queryRunner.query(`DROP INDEX \`FK_7e0d6cf6173772c12089cf97474\` ON \`submission_answers\``);
        await queryRunner.query(`ALTER TABLE \`course_exams\` ADD CONSTRAINT \`FK_29a308bdbd13226abc955077242\` FOREIGN KEY (\`examId\`) REFERENCES \`exams\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`course_exams\` ADD CONSTRAINT \`FK_a428c82951a6c51f2630895f202\` FOREIGN KEY (\`courseId\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_32cd92f2cd6b9438d6425bff0b8\` FOREIGN KEY (\`examId\`) REFERENCES \`exams\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`choices\` ADD CONSTRAINT \`FK_c5164e6bff485bcfafcac9703d3\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`statements\` ADD CONSTRAINT \`FK_2c21560fe70e685b75cb7a9c87a\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question_answers\` ADD CONSTRAINT \`FK_cc2642c5e8deced1208e60ce950\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question_images\` ADD CONSTRAINT \`FK_ff54078f094e7ef1353f215021f\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`solutions\` ADD CONSTRAINT \`FK_edca376bb8a4ecf65c7b84d452b\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`solution_images\` ADD CONSTRAINT \`FK_35493b8cddf672d0975ae7076ec\` FOREIGN KEY (\`solutionId\`) REFERENCES \`solutions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`submissions\` ADD CONSTRAINT \`FK_eae888413ab8fc63cc48759d46a\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`submissions\` ADD CONSTRAINT \`FK_c02ac1ed5c479c123df59596513\` FOREIGN KEY (\`courseId\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`submissions\` ADD CONSTRAINT \`FK_f2f7f7ccde3bf5c6f70bd378a94\` FOREIGN KEY (\`examId\`) REFERENCES \`exams\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`submission_answers\` ADD CONSTRAINT \`FK_49b240a1fb2de5d9308d2125597\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`submission_answers\` ADD CONSTRAINT \`FK_7e0d6cf6173772c12089cf97474\` FOREIGN KEY (\`submissionId\`) REFERENCES \`submissions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
        await queryRunner.query(`CREATE INDEX \`FK_7e0d6cf6173772c12089cf97474\` ON \`submission_answers\` (\`submissionId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_49b240a1fb2de5d9308d2125597\` ON \`submission_answers\` (\`questionId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_f2f7f7ccde3bf5c6f70bd378a94\` ON \`submissions\` (\`examId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_eae888413ab8fc63cc48759d46a\` ON \`submissions\` (\`userId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_c02ac1ed5c479c123df59596513\` ON \`submissions\` (\`courseId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_35493b8cddf672d0975ae7076ec\` ON \`solution_images\` (\`solutionId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_edca376bb8a4ecf65c7b84d452b\` ON \`solutions\` (\`questionId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_ff54078f094e7ef1353f215021f\` ON \`question_images\` (\`questionId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_cc2642c5e8deced1208e60ce950\` ON \`question_answers\` (\`questionId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_2c21560fe70e685b75cb7a9c87a\` ON \`statements\` (\`questionId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_c5164e6bff485bcfafcac9703d3\` ON \`choices\` (\`questionId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_32cd92f2cd6b9438d6425bff0b8\` ON \`questions\` (\`examId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_a428c82951a6c51f2630895f202\` ON \`course_exams\` (\`courseId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_29a308bdbd13226abc955077242\` ON \`course_exams\` (\`examId\`)`);
    }

}
