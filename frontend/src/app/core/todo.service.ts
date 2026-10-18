import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  id: number;
  title: string;
  isDone: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  // Must match the HTTPS port printed by `dotnet run` in backend/.
  private readonly apiUrl = 'https://localhost:7299/api/todos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  create(title: string): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, { title });
  }

  toggle(todo: Todo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${todo.id}`, {
      title: todo.title,
      isDone: !todo.isDone
    });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
