import { User } from './entities/user.entity';
import { Document } from './entities/document.entity';
import { JobApplication } from './entities/jobApplication.entity';
import { Administrator } from './entities/administrator.entity';
import { JobPreference } from './entities/jobPreference.entity';
import { JobSeeker } from './entities/jobSeeker.entity';
import { EventListing } from "./entities/eventListing.entity";
import { EventRegistration } from "./entities/eventRegistration.entity";

export const entityList = [
  User,
  Administrator,
  JobPreference,
  JobSeeker,
  Document,
  JobApplication,
  EventListing,
  EventRegistration
];