import { Component, input } from '@angular/core';
import { IComment } from '../../interfaces/comment';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.html',
  imports: [CommonModule, AvatarModule],
})
export class Comment {
  readonly comment = input<IComment>();
  readonly authorName = input<string>();
  readonly authorAvatar = input<string>();

}
