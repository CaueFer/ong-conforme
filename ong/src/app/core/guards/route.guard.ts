import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "../services/auth/auth.service";


@Injectable()
export class RouteGuard implements CanActivate{

    constructor(private _authService: AuthenticationService, private router: Router){ }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        const isAutheticated = this._authService.getIsAutheticated();
        if(!isAutheticated){
            this.router.navigate(['account']);
        }
        return isAutheticated;
    }
}