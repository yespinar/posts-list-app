export interface IComment {
  id: number;
  postId: number;
  userId: number;
  body: string;
  createdAt: Date;
}
