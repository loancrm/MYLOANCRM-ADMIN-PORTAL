import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { LeadsService } from '../admin/leads/leads.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  showPassword: boolean = false;
  loading = false;
  otpSent = false;
  isPasswordVisible: boolean = false;
  otpVerified = false;
  otpError = '';
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private leadsService: LeadsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      businessName: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]],
      otp: [''] // ✅ ADD THIS LINE
    });
  }

  get name() {
    return this.registerForm.get('name')!;
  }

  get email() {
    return this.registerForm.get('emailId')!;
  }

  get mobile() {
    return this.registerForm.get('mobile')!;
  }

  get businessName() {
    return this.registerForm.get('businessName')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  sendOTP() {
    // console.log('Mobile value from form:', this.mobile.value);
    // console.log('Form object:', this.registerForm.value);
    const mobile = this.mobile.value;
    if (!mobile || this.mobile.invalid) {
      // console.log(mobile)
      this.toastService.showWarn('Enter a valid mobile number before requesting OTP');
      return;
    }

    this.leadsService.sendOtp({ mobile }).subscribe({
      next: () => {
        this.toastService.showSuccess('OTP sent successfully');
        this.otpSent = true;
      },
      error: () => {
        this.toastService.showError('Failed to send OTP');
      }
    });
  }
  verifyOTP() {
    const mobile = this.mobile.value;
    const otp = this.registerForm.get('otp')?.value;

    if (!otp) {
      this.otpError = 'OTP is required';
      return;
    }

    this.leadsService.verifyOtp({ mobile, otp }).subscribe({
      next: () => {
        this.toastService.showSuccess('OTP verified');
        this.otpVerified = true;
        this.otpError = '';
      },
      error: () => {
        this.otpError = 'Invalid OTP';
      }
    });
  }
  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    if (this.registerForm.invalid || !this.otpVerified) {
      if (!this.otpVerified) this.otpError = 'Please verify OTP before registering.';
      return;
    }

    this.loading = true;

    const formData = {
      name: this.name.value,
      emailId: this.email.value.toLowerCase(),
      mobile: this.mobile.value,
      businessName: this.businessName.value,
      password: this.password.value,
    };

    this.leadsService.createAccount(formData).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.showSuccess('Account created successfully');
        this.router.navigate(['/user/login']);
      },
      error: (error) => {
        this.loading = false;
        const message = error?.error || 'Error creating account';
        this.toastService.showError(error);
      }
    });
  }

}
