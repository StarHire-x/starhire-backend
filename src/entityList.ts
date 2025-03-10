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
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/chatMessage.entity';
import { Commission } from './entities/commission.entity';
import { Invoice } from './entities/invoice.entity';
import { JobExperience } from './entities/jobExperience.entity';
import { JobAssignment } from './entities/jobAssignment.entity';
import { SavedJobListing } from './entities/savedJobListing.entity';
import { ForumCategory } from './entities/forumCategory.entity';
import { CorporateTypeform } from './entities/corporateTypeform.entity';
import { JobseekerTypeform } from './entities/jobseekerTypeform.entity';
import { CommissionRate } from './entities/commissionRate.entity';
import { Review } from './entities/review.entity';

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
  JobExperience,
  ForumPost,
  ForumCategory,
  ForumComment,
  EventListing,
  EventRegistration,
  Ticket,
  Chat,
  ChatMessage,
  Commission,
  Invoice,
  JobAssignment,
  SavedJobListing,
  CorporateTypeform,
  JobseekerTypeform,
  CommissionRate,
  Review,
];
