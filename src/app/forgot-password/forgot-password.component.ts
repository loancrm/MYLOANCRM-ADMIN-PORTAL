import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotForm: UntypedFormGroup;
  apiLoading = false;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.apiLoading = true;
    const email = this.forgotForm.value.email;

    this.authService.forgotPassword({ email }).subscribe(
      (res) => {
        this.apiLoading = false;
        this.toastService.showSuccess(
          'Password reset link sent to your email.'
        );
      },
      (err) => {
        this.apiLoading = false;
        this.toastService.showError(err);
      }
    );
  }
}
