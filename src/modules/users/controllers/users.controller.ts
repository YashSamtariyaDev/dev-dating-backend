import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { UsersService } from '../services/users.service';
import { ProfileCompletedGuard } from '../../../common/guards/profile-completed.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { BrowseUserDto } from '../dto/user-browse.dto';
import { AdminUserDto } from '../dto/admin-user.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('all-users')
    async getAllUsers() {
        const users = await this.usersService.findAll();
        return users.map(user => this.mapToAdminDto(user));
    }

    @UseGuards(JwtAuthGuard, ProfileCompletedGuard)
    @Get('browse')
    async browse(@CurrentUser() user) {
        const users = await this.usersService.browseUsers(Number(user.userId));
        return users.map(u => this.mapToBrowseDto(u));
    }

    @UseGuards(JwtAuthGuard, ProfileCompletedGuard)
    @Get('discover')
    async discover(@CurrentUser() user) {
        const users = await this.usersService.discoverUsers(Number(user.userId));
        return users.map(u => this.mapToBrowseDto(u));
    }

    private mapToBrowseDto(user: any): BrowseUserDto {
        const p = user.profile || {};
        return {
            id: user.id,
            name: user.name,
            bio: p.bio,
            age: p.age,
            gender: p.gender,
            techStack: p.techStack || [],
            experienceLevel: p.experienceLevel,
            location: p.location,
        };
    }

    private mapToAdminDto(user: any): AdminUserDto {
        const p = user.profile || {};
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            bio: p.bio,
            age: p.age,
            gender: p.gender,
            lookingFor: p.lookingFor,
            techStack: p.techStack || [],
            experienceLevel: p.experienceLevel,
            location: p.location,
            githubUsername: p.githubUsername,
            linkedinUrl: p.linkedinUrl,
            portfolioUrl: p.portfolioUrl,
            isAvailable: p.isAvailable,
            latitude: p.latitude,
            longitude: p.longitude,
        };
    }

}
