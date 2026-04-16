import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../auth/services/auth.service';
import { PostsService } from '../../services/posts.service';
import { IPostForm } from '../../interfaces/post-new-form';
import { ICreatePostPayload } from '../../interfaces/create-post-payload';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.html',
  imports: [CommonModule, TranslatePipe, ButtonModule, InputTextModule, TextareaModule],
})
export class PostNew {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly postsService = inject(PostsService);

  postForm = signal<IPostForm>({ title: '', body: '', tags: '' });

  canSubmit = computed(() => {
    const form = this.postForm();
    return form.title.trim().length > 0 && form.body.trim().length > 0;
  });

  updateTitle(value: string): void {
    this.postForm.update((form) => ({ ...form, title: value }));
  }

  updateBody(value: string): void {
    this.postForm.update((form) => ({ ...form, body: value }));
  }

  updateTags(value: string): void {
    this.postForm.update((form) => ({ ...form, tags: value }));
  }

  onCancel(): void {
    this.resetForm();
    this.router.navigateByUrl('/posts');
  }

  onPublish(): void {
    if (!this.canSubmit()) {
      return;
    }

    const userId = this.authService.getSession()?.user?.id;
    if (!userId) {
      console.error('Authenticated user not found.');
      return;
    }

    const form = this.postForm();
    const payload: ICreatePostPayload = {
      title: form.title.trim(),
      body: form.body.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    this.postsService.createPost(payload, userId).subscribe({
      next: () => {
        this.resetForm();
        this.router.navigateByUrl('/posts');
      },
      error: (error) => {
        console.error('Failed to publish post', error);
      },
    });
  }

  private resetForm(): void {
    this.postForm.set({ title: '', body: '', tags: '' });
  }
}
