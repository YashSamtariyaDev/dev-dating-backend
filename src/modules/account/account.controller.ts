import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  UseGuards, 
  Req,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('account')
@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('request-deletion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request account deletion' })
  @ApiResponse({ status: 200, description: 'Deletion request received' })
  async requestDeletion(@Req() req) {
    const userId = req.user.userId;
    return this.accountService.requestAccountDeletion(userId);
  }

  @Post('confirm-deletion/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm account deletion with token' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  async confirmDeletion(@Param('token') token: string) {
    return this.accountService.confirmAccountDeletion(token);
  }

  @Post('deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate account' })
  @ApiResponse({ status: 200, description: 'Account deactivated successfully' })
  async deactivate(@Req() req) {
    const userId = req.user.userId;
    return this.accountService.deactivateAccount(userId);
  }

  @Post('reactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reactivate account' })
  @ApiResponse({ status: 200, description: 'Account reactivated successfully' })
  async reactivate(@Req() req) {
    const userId = req.user.userId;
    return this.accountService.reactivateAccount(userId);
  }

  @Post('send-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send email verification' })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  async sendVerification(@Req() req) {
    const userId = req.user.userId;
    return this.accountService.sendEmailVerification(userId);
  }

  @Get('verify-email/:token')
  @ApiOperation({ summary: 'Verify email with token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  async verifyEmail(@Param('token') token: string) {
    return this.accountService.verifyEmail(token);
  }
}
