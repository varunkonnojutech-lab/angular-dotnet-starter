import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Todo, TodoService } from '../../core/todo.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="todos">
      <header>
        <h1>My todos</h1>
        <button (click)="logout()">Logout</button>
      </header>
      <form (ngSubmit)="add()">
        <input [(ngModel)]="newTitle" name="title" placeholder="What needs doing?" />
        <button type="submit" [disabled]="!newTitle.trim()">Add</button>
      </form>
      <ul>
        <li *ngFor="let todo of todos">
          <input type="checkbox" [checked]="todo.isDone" (change)="toggle(todo)" />
          <span [class.done]="todo.isDone">{{ todo.title }}</span>
          <button (click)="remove(todo)">Delete</button>
        </li>
      </ul>
      <p *ngIf="todos.length === 0">Nothing here yet — add your first todo.</p>
    </div>
  `,
  styles: [`
    .todos { max-width: 560px; margin: 2rem auto; padding: 0 1rem; }
    header { display: flex; justify-content: space-between; align-items: center; }
    form { display: flex; gap: 0.5rem; margin: 1rem 0; }
    form input { flex: 1; padding: 0.5rem; }
    ul { padding: 0; }
    li { list-style: none; display: flex; gap: 0.5rem; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #eee; }
    li span { flex: 1; }
    .done { text-decoration: line-through; color: #999; }
  `]
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  newTitle = '';

  constructor(
    private todoService: TodoService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.todoService.getAll().subscribe((todos) => (this.todos = todos));
  }

  add(): void {
    const title = this.newTitle.trim();
    if (!title) {
      return;
    }
    this.todoService.create(title).subscribe((todo) => {
      this.todos.push(todo);
      this.newTitle = '';
    });
  }

  toggle(todo: Todo): void {
    this.todoService.toggle(todo).subscribe(() => {
      todo.isDone = !todo.isDone;
    });
  }

  remove(todo: Todo): void {
    this.todoService.remove(todo.id).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id !== todo.id);
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
