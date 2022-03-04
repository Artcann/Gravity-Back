import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/decorators/roles.decorator";
import { Role } from "src/entities/enums/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      console.log(requiredRoles);

      if(!requiredRoles) {
        return true;
      }
      const { user } = context.switchToHttp().getRequest();
      console.log(user);
      return requiredRoles.some((role) => user.roles?.includes(role));
  }
}