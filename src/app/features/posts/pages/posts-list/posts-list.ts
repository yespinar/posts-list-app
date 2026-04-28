import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { PostCard } from '../../components/post-card/post-card';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.html',
  imports: [CommonModule, TranslatePipe, SelectModule, FormsModule, PostCard, PaginatorModule, ButtonModule, RouterModule],
})
export class PostsList {
  postService = inject(PostsService);
  private readonly translateService = inject(TranslateService);
  posts = toSignal(this.postService.getPosts(), { initialValue: [] });
  users = toSignal(this.postService.getUsers(), { initialValue: [] });
  selectedAuthor = signal<number | null>(null);
  selectedTag = signal<string | null>(null);

  first = signal(0);
  rows = signal(10);
  allAuthorsLabel = toSignal(this.translateService.stream('POSTS.ALL_AUTHORS'), {
    initialValue: this.translateService.instant('POSTS.ALL_AUTHORS'),
  });
  allTagsLabel = toSignal(this.translateService.stream('POSTS.ALL_TAGS'), {
    initialValue: this.translateService.instant('POSTS.ALL_TAGS'),
  });

  authors = computed<{ label: string; value: number | null }[]>(() => [
    { label: this.allAuthorsLabel(), value: null },
    ...this.users()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((user) => ({
        label: user.name.charAt(0).toUpperCase() + user.name.slice(1),
        value: user.id,
      })),
  ]);

  tags = computed(() => {
    const posts = this.posts() ?? [];
    const uniqueTags = new Set<string>();

    posts.forEach((post) => {
      post.tags?.forEach((tag) => uniqueTags.add(tag));
    });

    return [
      { label: this.allTagsLabel(), value: '' },
      ...[...uniqueTags].sort((a, b) => a.localeCompare(b)).map((tag) => ({ label: tag.charAt(0).toUpperCase() + tag.slice(1), value: tag })),
    ];
  });

  authorProfiles = computed(() => {
    const profiles: Record<number, { name: string; avatar: string }> = {};

    (this.users() ?? []).forEach((user) => {
      profiles[user.id] = {
        name: user.name.charAt(0).toUpperCase() + user.name.slice(1),
        avatar: user.avatar,
      };
    });

    return profiles;
  });

  filteredPosts = computed(() => {
    const selectedAuthorId = this.selectedAuthor();
    const selectedTagValue = this.selectedTag();

    return (this.posts() ?? []).filter((post) => {
      const authorMatches = selectedAuthorId ? post.userId === selectedAuthorId : true;
      const tagMatches = selectedTagValue ? post.tags.includes(selectedTagValue) : true;
      return authorMatches && tagMatches;
    });
  });

  paginatePosts = computed(() => {
    const start = this.first();
    const end = start + this.rows();
    return this.filteredPosts().slice(start, end);
  });

  pageReportParams = computed(() => {
    const total = this.filteredPosts().length;
    const start = total === 0 ? 0 : this.first() + 1;
    const end = Math.min(this.first() + this.rows(), total);

    return { start, end, total };
  });

  onAuthorChange(authorId: number | null): void {
    this.selectedAuthor.set(authorId);
    this.first.set(0);
  }

  onTagChange(tag: string | null): void {
    this.selectedTag.set(tag);
    this.first.set(0);
  }

  onPageChange(event: PaginatorState) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
  }
}
