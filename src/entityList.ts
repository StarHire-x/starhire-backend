import { User } from './entities/user.entity';
import { Document } from './entities/document.entity';
import { JobApplication } from './entities/jobApplication.entity';
import { Administrator } from './entities/administrator.entity';
import { JobPreference } from './entities/jobPreference.entity';

export const entityList = [
  User,
  Administrator,
  JobPreference,
  Document,
  JobApplication,
];
