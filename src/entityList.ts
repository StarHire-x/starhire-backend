import { User } from './entities/user.entity';
import { Document } from './entities/document.entity';
import { JobApplication } from './entities/jobApplication.entity';
import { ForumPost } from './entities/forumPost.entity';
import { ForumComment } from './entities/forumComment.entity';
import { JobListing } from './entities/jobListing.entity';
import { Administrator } from './entities/administrator.entity';
import { JobPreference } from './entities/jobPreference.entity';
import { JobSeeker } from './entities/jobSeeker.entity';
import { EventListing } from './entities/eventListing.entity';
import { EventRegistration } from './entities/eventRegistration.entity';
import { Recruiter } from './entities/recruiter.entity';
import { Corporate } from './entities/corporate.entity';
import { Ticket } from './entities/ticket.entity';

export const entityList = [
  User,
  Administrator,
  Recruiter,
  JobSeeker,
  Corporate,
  Document,
  JobListing,
  JobApplication,
  JobPreference,
  ForumPost,
  ForumComment,
  EventListing,
  EventRegistration,
  Ticket,
];
