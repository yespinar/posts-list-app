import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { PostsService } from '../../services/posts.service';
import { IPost } from '../../interfaces/post';
import { AvatarModule } from 'primeng/avatar';
import { Comment } from '../../components/comment/comment';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.html',
  imports: [CommonModule, RouterModule, AvatarModule, Comment],
})
export class PostDetail {
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

  readonly comments = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => this.postsService.getCommentsByPostId(id)),
    ),
    { initialValue: [] }
  );

  readonly authorName = computed(() => {
    const author = this.users().find((user) => user.id === this.post()?.userId);
    return author ? author.name.charAt(0).toUpperCase() + author.name.slice(1) : 'Unknown';
  });

  readonly authorAvatar = computed(() => this.users().find((user) => user.id === this.post()?.userId)?.avatar ?? '');
}
