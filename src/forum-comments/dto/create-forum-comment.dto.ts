export class CreateForumCommentDto {
  createdAt: Date;
  forumCommentMessage: string;
  isAnonymous: boolean;
  jobSeekerId: number; // Parent relationship
  forumPostId: number; // Parent relationship
}
