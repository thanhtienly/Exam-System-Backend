import { Injectable } from '@nestjs/common';
import { ExtractedQuestion } from '../dto/extract.dto';
import { spawn } from 'child_process';
import { StringDecoder } from 'string_decoder';
import * as path from 'path';

@Injectable()
export class ExtractService {
  constructor() {}

  extractQuestion(fileName: string): Promise<ExtractedQuestion[]> {
    const decoder = new StringDecoder('utf-8');
    const promise = new Promise<ExtractedQuestion[]>((resolve, reject) => {
      const extractFileProcess = spawn('python', [
        /* path of python service to extract file */
        path.join(__dirname, '../../../src/scripts/extract_question.py'),
        /* path of file that needed to extract  */
        path.join(__dirname, `../../../src/uploads/docs/${fileName}`),
        /* directory of expect folder to store extracted image */
        path.join(__dirname, `../../../src/uploads/images`),
      ]);

      let data = '';
      extractFileProcess.stdout.on('data', (chunk) => {
        data += decoder.write(chunk);
      });

      extractFileProcess.stderr.on('data', (data) => {
        reject(new Error('Error'));
      });

      extractFileProcess.on('close', (code) => {
        if (code != 0) {
          reject(new Error('Error'));
        } else {
          data += decoder.end();

          try {
            var questionList: ExtractedQuestion[] = JSON.parse(data);
            resolve(questionList);
          } catch (error) {
            reject(new Error('Something went wrong when parse exam question'));
          }
        }
      });
    });

    return promise;
  }
}
