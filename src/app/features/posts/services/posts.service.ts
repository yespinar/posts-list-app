import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/post';
import type { User } from '../../auth/interfaces/user';
import { CreatePostPayload } from '../interfaces/create-post-payload';


@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/posts`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  createPost(post: CreatePostPayload, userId: number): Observable<Post> {
    const payload = {
      ...post,
      userId,
      createdAt: new Date().toISOString(),
    };

    return this.http.post<Post>(`${this.baseUrl}/posts`, payload);
  }
}
