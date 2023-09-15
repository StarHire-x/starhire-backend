export class CreateForumCommentDto {
  createdAt: Date;
  forumCommentMessage: string;
  isAnonymous: boolean;
  jobSeekerId: string; // Parent relationship
  forumPostId: number; // Parent relationship
}
