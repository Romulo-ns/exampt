import { Module } from '@nestjs/common';
import { ExamPdfController } from './exam-pdf.controller';
import { ExamPdfService } from './exam-pdf.service';

@Module({
  controllers: [ExamPdfController],
  providers: [ExamPdfService],
})
export class ExamPdfModule {}
