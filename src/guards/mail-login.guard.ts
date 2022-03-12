import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "src/services/user.service";

@Injectable()
export class MailLoginGuard implements CanActivate {
    constructor(private userService: UserService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const { email } = context.switchToHttp().getRequest().body;
        console.log(null != this.userService.findOne(email));
        return null != this.userService.findOne(email);
    }
    
    async validateUser(email: string) {
        const user = await this.userService.findOne(email);
        //TODO Verifier Token
    }
}