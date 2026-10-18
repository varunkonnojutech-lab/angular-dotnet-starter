import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-card">
      <h1>{{ isRegistering ? 'Create account' : 'Sign in' }}</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Username
          <input formControlName="username" autocomplete="username" />
        </label>
        <label>Password
          <input type="password" formControlName="password" autocomplete="current-password" />
        </label>
        <p class="error" *ngIf="error">{{ error }}</p>
        <button type="submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Please wait...' : (isRegistering ? 'Register' : 'Login') }}
        </button>
      </form>
      <button class="link" (click)="isRegistering = !isRegistering">
        {{ isRegistering ? 'Have an account? Sign in' : 'No account? Register' }}
      </button>
    </div>
  `,
  styles: [`
    .auth-card { max-width: 360px; margin: 4rem auto; padding: 2rem; border: 1px solid #ddd; border-radius: 8px; background: #fff; }
    label { display: block; margin-bottom: 1rem; }
    input { width: 100%; padding: 0.5rem; margin-top: 0.25rem; }
    button { padding: 0.5rem 1rem; }
    .link { background: none; border: none; color: #1976d2; cursor: pointer; margin-top: 1rem; padding: 0; }
    .error { color: #c62828; }
  `]
})
export class LoginComponent {
  form: FormGroup;
  isRegistering = false;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.error = '';
    const { username, password } = this.form.value;
    const request = this.isRegistering
      ? this.auth.register(username, password)
      : this.auth.login(username, password);

    request.subscribe({
      next: () => this.router.navigate(['/todos']),
      error: () => {
        this.error = 'Authentication failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
