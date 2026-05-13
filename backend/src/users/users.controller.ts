import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Post,
  Put
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('me/nick')
  @UseGuards(JwtAuthGuard)
  async updateNick(@Request() req: any, @Body('nick') nick: string) {
    return this.usersService.updateNick(req.user.id, nick);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Request() req: any) {
    return this.usersService.getUserStats(req.user.id);
  }

  @Get('check-nick')
  async checkNick(@Query('nick') nick: string) {
    const available = await this.usersService.checkNickAvailable(nick);
    return { available };
  }

  // --- ADMIN ENDPOINTS ---

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAllAdmin(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('plan') plan?: string,
  ) {
    return this.usersService.findAllAdmin(parseInt(page), parseInt(limit), search, role, plan);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateAdmin(@Param('id') id: string, @Body() data: any) {
    return this.usersService.updateAdmin(id, data);
  }

  @Post('admin/:id/reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async resetPasswordAdmin(
    @Param('id') id: string,
    @Body('password') newPassword: string,
  ) {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.usersService.resetPasswordAdmin(id, passwordHash);
    return { message: 'Password reset successful' };
  }
}
