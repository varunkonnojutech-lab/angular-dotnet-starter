import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { TodosComponent } from './features/todos/todos.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'todos', component: TodosComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'todos' }
];
