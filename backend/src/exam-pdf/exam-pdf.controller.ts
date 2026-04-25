import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ExamPdfService } from './exam-pdf.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PremiumGuard } from '../auth/guards/premium.guard';

@Controller('exam-pdf')
export class ExamPdfController {
  constructor(private readonly examPdfService: ExamPdfService) {}

  /**
   * GET /api/exam-pdf/generate?subjectId=...&count=15
   * Premium-only endpoint that generates and returns a PDF exam.
   */
  @Get('generate')
  @UseGuards(JwtAuthGuard, PremiumGuard)
  async generatePdf(
    @Query('subjectId') subjectId: string,
    @Query('count') countStr: string,
    @Res() res: Response,
  ) {
    if (!subjectId) {
      throw new BadRequestException('O parâmetro subjectId é obrigatório.');
    }

    let count = parseInt(countStr, 10);
    if (isNaN(count) || count < 5) count = 15;
    if (count > 20) count = 20;

    const pdfBuffer = await this.examPdfService.generateExamPdf(
      subjectId,
      count,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ExamPT_Exame.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
