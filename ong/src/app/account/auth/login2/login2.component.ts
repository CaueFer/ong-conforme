import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { AuthenticationService } from "../../../core/services/auth/auth.service";

import { OwlOptions } from "ngx-owl-carousel-o";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login2",
  templateUrl: "./login2.component.html",
  styleUrls: ["./login2.component.scss"],
})
export class Login2Component implements OnInit {
  loginForm: UntypedFormGroup;
  submitted: boolean = false;
  returnUrl: string;
  showPassword: boolean = false;
  continueLogged: boolean = false;

  year: number = new Date().getFullYear();

  successmsg: string = "";
  errormsg: string = "";

  private authenticatedSub!: Subscription;
  private isAuthenticated: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _authService: AuthenticationService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }
  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";

    this.authenticatedSub = this._authService
      .getAuthentication()
      .subscribe((data) => {
        if (data) {
          this.isAuthenticated = data;
          this.router.navigate(["ong-conforme"]);
        }
      });

    this._authService.authFromLocalStorage();
  }

  ngOnDestroy(): void {
    this.authenticatedSub.unsubscribe();
  }

  carouselOption: OwlOptions = {
    items: 1,
    loop: false,
    margin: 0,
    nav: false,
    dots: true,
    responsive: {
      680: {
        items: 1,
      },
    },
  };

  submitLogin() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.errormsg = "Campos invalidos.";

      return;
    }

    if (this.loginForm.valid) {
      this._authService
        .loginUser(
          this.f["email"].value,
          this.f["password"].value,
          this.continueLogged
        )
        .then((data) => {
          //console.log(data);
        })
        .catch((err) => {
          //console.log(err);
          this.errormsg = err;
        });
    }
  }

  togglePass(): void {
    this.showPassword = !this.showPassword;
  }

  toggleLoged() {
    this.continueLogged = !this.continueLogged;
  }
}
