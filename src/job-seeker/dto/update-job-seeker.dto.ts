import { CreateForumCommentDto } from 'src/forum-comments/dto/create-forum-comment.dto';
import { CreateJobSeekerDto } from './create-job-seeker.dto';
import { CreateJobPreferenceDto } from 'src/job-preference/dto/create-job-preference.dto';
import { CreateJobApplicationDto } from 'src/job-application/dto/create-job-application.dto';
import { CreateForumPostDto } from 'src/forum-posts/dto/create-forum-post.dto';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';

export class UpdateJobSeekerDto extends CreateJobSeekerDto {
    forumComments: CreateForumCommentDto[];
    jobPreference: CreateJobPreferenceDto;
    jobApplications: CreateJobApplicationDto[];
    forumPosts: CreateForumPostDto[];
    chats: CreateChatDto[];
}
