import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPost } from '../../interfaces/post';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.html',
  imports: [CommonModule, AvatarModule],
})
export class PostCard {
  readonly post = input<IPost>();
  readonly authorName = input<string>();
  readonly authorAvatar = input<string>();
  readonly router = inject(Router);

  onClick(): void {
    this.router.navigate(['/post', this.post()?.id]);
  }
}
