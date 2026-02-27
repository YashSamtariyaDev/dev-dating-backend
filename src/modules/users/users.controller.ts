import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersService } from './users.service';
import { ProfileCompletedGuard } from 'src/common/guards/profile-completed.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('all-users')
    getAllUsers() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard, ProfileCompletedGuard)
    @Get('browse')
    browse(@CurrentUser() user) {
        return this.usersService.browseUsers(Number(user.userId));
    }


}
