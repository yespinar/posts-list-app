import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../services/posts.service';
import type { Post } from '../interfaces/post';
import { PostCard } from '../components/post-card/post-card';

interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.html',
  imports: [CommonModule, TranslatePipe, SelectModule, FormsModule, PostCard],
})
export class Posts {
  postService = inject(PostsService);
  posts = toSignal(this.postService.getPosts(), { initialValue: [] });
  users = toSignal(this.postService.getUsers(), { initialValue: [] });
  selectedAuthor = signal<number | null>(null);
  selectedTag = signal<string | null>(null);

  authors = computed<SelectOption<number | null>[]>(() => [
    { label: 'All authors', value: null },
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
      { label: 'All tags', value: '' },
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
}
