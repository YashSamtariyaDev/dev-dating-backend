import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { ProfileService } from "src/modules/profile/profile.service";

@Injectable()
export class ProfileCompletedGuard implements CanActivate {
  constructor(private readonly profileService: ProfileService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user || !user.userId) {
      throw new ForbiddenException('Invalid authentication token');
    }

    const isCompleted = await this.profileService.isProfileCompleted(
      Number(user.userId),
    );

    if (!isCompleted) {
      throw new ForbiddenException(
        'Please complete your profile before accessing this feature.',
      );
    }

    return true;
  }
}


