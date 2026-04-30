import { Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ICommentForm } from '../../interfaces/comment-new-form';
import { PostsService } from '../../services/posts.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';


@Component({
  selector: 'app-add-comment-form',
  templateUrl: './add-comment-form.html',
  imports: [CommonModule, TranslatePipe, ButtonModule, TextareaModule],
})
export class AddCommentForm {
  readonly postId = input<number>();
  readonly commentCreated = output<void>();
  
  private readonly authService = inject(AuthService);
  private readonly postsService = inject(PostsService);

  commentForm = signal<ICommentForm>({ comment: '' });

  canSubmit = computed(() => {
    const form = this.commentForm();
    return form.comment.trim().length > 0;
  });

  updateComment(value: string) {
    this.commentForm.update((form) => ({ ...form, comment: value }));
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

    const form = this.commentForm();
    const payload = {
      postId: Number(this.postId()),
      userId,
      body: form.comment,
      createdAt: new Date(),
    };

    this.postsService.createComment(payload).subscribe({
      next: () => {
        this.resetForm();
        this.commentCreated.emit();
      },
      error: (error) => {
        console.error('Failed to publish post', error);
      },
    });
  }

  private resetForm(): void {
    this.commentForm.set({ comment: '' });
  }
}
