import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.error = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          // After registration, automatically log in the user
          this.authService.login({
            email: this.registerForm.value.email,
            password: this.registerForm.value.password
          }).subscribe({
            next: () => {
              this.router.navigate(['/products']);
            },
            error: (error) => {
              this.error = 'Registration successful but login failed: ' + (error.message || 'An error occurred');
              this.isLoading = false;
            }
          });
        },
        error: (error) => {
          this.error = error.message || 'An error occurred during registration';
          this.isLoading = false;
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (controlName === 'name') {
      if (control.errors['required']) return 'Name is required';
      if (control.errors['minlength']) return 'Name must be at least 2 characters';
    }

    if (controlName === 'email') {
      if (control.errors['required']) return 'Email is required';
      if (control.errors['email']) return 'Invalid email format';
    }

    if (controlName === 'password') {
      if (control.errors['required']) return 'Password is required';
      if (control.errors['minlength']) return 'Password must be at least 6 characters';
    }

    return '';
  }
}
