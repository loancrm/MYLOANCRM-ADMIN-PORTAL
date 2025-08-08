import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetForm!: FormGroup;
  token: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: this.passwordsMatch
    });
  }

  get password() {
    return this.resetForm.get('password')!;
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword')!;
  }

  passwordsMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notMatching: true };
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const { password } = this.resetForm.value;
      const data = {
        token: this.token,
        password: password
      };

      this.authService.resetPassword(data).subscribe({
        next: () => {
          this.toastService.showSuccess('Password reset successfully!');
          this.router.navigate(['user/login']);
        },

        error: (error) => {
          // console.log('Reset password error:', error);
          this.toastService.showError(error);
        }
      });
    }
  }

}
