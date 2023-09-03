import { PartialType } from '@nestjs/mapped-types';
import { CreateForumPostDto } from './create-forum-post.dto';

export class UpdateForumPostDto extends PartialType(CreateForumPostDto) {}
