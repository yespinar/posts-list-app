import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { PostsService } from '../../services/posts.service';
import { IPost } from '../../interfaces/post';
import { AvatarModule } from 'primeng/avatar';
import { Comment } from '../../components/comment/comment';
import { TranslatePipe } from '@ngx-translate/core';
import { AddCommentForm } from '../../components/add-comment-form/add-comment-form';
import { IComment } from '../../interfaces/comment';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.html',
  imports: [CommonModule, RouterModule, AvatarModule, Comment, TranslatePipe, AddCommentForm],
})
export class PostDetail {
  readonly comments = signal<IComment[]>([]);
  private readonly route = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);

  readonly users = toSignal(this.postsService.getUsers(), { initialValue: [] });
  readonly post = toSignal<IPost | null>(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => this.postsService.getPostById(id)),
    ),
    { initialValue: null },
  );

  readonly authorName = computed(() => {
    const author = this.users().find((user) => user.id === this.post()?.userId);
    return author ? author.name.charAt(0).toUpperCase() + author.name.slice(1) : 'Unknown';
  });

  readonly authorAvatar = computed(() => this.users().find((user) => user.id === this.post()?.userId)?.avatar ?? '');

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const postId = Number(params.get('id'));
      this.loadComments(postId);
    });
  }

  loadComments(postId: number): void {
    this.postsService.getCommentsByPostId(postId).subscribe({
      next: (comments) => {
        const sortedComments = comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.comments.set(sortedComments);
      },
    });
  }

  reloadComments(): void {
    const postId = this.post()?.id;
    if (!postId) return;
    this.loadComments(postId);
  }
}
