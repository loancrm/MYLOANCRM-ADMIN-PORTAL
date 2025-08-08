import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { jwtDecode } from 'jwt-decode';
import { SelectItem } from 'primeng/api';
import { LeadsService } from '../admin/leads/leads.service';
import { projectConstantsLocal } from '../constants/project-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: UntypedFormGroup;
  isPasswordVisible: boolean = false;
  leadUsers: any = [];
  api_loading: any = false;
  version = projectConstantsLocal.VERSION_DESKTOP;
  carousalImages: any = [
    {
      url: 'assets/images/slider/slider-1.png',
    },
    {
      url: 'assets/images/slider/slider-2.png',
    },
    {
      url: 'assets/images/slider/slider-3.png',
    },
  ];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  ngOnInit() {
    this.createForm();
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  doForgotPassword() {
    this.router.navigate(['/user/forgot-password']);
  }
  createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }
  onSubmit(loginData) {
    let payload = {
      username: loginData.username,
      password: loginData.password,
    };
    this.api_loading = true;
    this.authService.userLogin(payload).subscribe(
      (data: any) => {
        // console.log(data);
        this.api_loading = false;
        if (data && data['accessToken']) {
          this.localStorageService.setItemOnLocalStorage(
            'accessToken',
            data['accessToken']
          );
          this.localStorageService.setItemOnLocalStorage(
            'userDetails',
            jwtDecode(data['accessToken'])
          );

          // this.router.navigate(['user', 'dashboard']);
          this.router.navigate(['user', 'dashboard'], {
            queryParams: { v: this.version },
          });
        }
      },
      (error) => {
        this.api_loading = false;
        this.toastService.showError(error);
      }
    );
  }
}
