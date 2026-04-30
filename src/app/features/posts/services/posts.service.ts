import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPost } from '../interfaces/post';
import type { User } from '../../auth/interfaces/user';
import { ICreatePostPayload } from '../interfaces/create-post-payload';
import { IComment } from '../interfaces/comment';


@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getPosts(): Observable<IPost[]> {
    return this.http.get<IPost[]>(`${this.baseUrl}/posts`);
  }

  getPostById(postId: number): Observable<IPost> {
    return this.http.get<IPost>(`${this.baseUrl}/posts/${postId}`);
  }

  createPost(post: ICreatePostPayload, userId: number): Observable<IPost> {
    const payload = {
      ...post,
      userId,
      createdAt: new Date().toISOString(),
    };

    return this.http.post<IPost>(`${this.baseUrl}/posts`, payload);
  }

  getCommentsByPostId(postId: number): Observable<IComment[]> {
    return this.http.get<IComment[]>(`${this.baseUrl}/posts/${postId}/comments`);
  }

  createComment(comment: Omit<IComment, 'id'>): Observable<IComment> {
    const payload = {
      ...comment,
    };
    return this.http.post<IComment>(`${this.baseUrl}/comments`, payload);
  }

}
