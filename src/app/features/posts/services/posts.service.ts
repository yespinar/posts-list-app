import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/post';
import type { User } from '../../auth/interfaces/user';



@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = 'http://localhost:3000';

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.authUrl}/posts`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.authUrl}/users`);
  }
}
