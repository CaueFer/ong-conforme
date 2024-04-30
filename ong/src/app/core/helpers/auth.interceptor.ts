import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../services/auth/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private _authService: AuthenticationService){}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = this._authService.getToken();

        if(!token) {
            return next.handle(req);
        }

        const authRequest = req.clone({
            headers: req.headers.set("authorization", token)
        })
        return next.handle(authRequest);
    }

}