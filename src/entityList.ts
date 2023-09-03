import { User } from "./entities/user.entity";
import { Document } from "./entities/document.entity";
import { JobApplication } from "./entities/jobApplication.entity";
import { Administrator } from "./entities/administrator.entity";
import { EventListing } from "./entities/eventListing.entity";
import { Recruiter } from "./entities/recruiter.entity";
import { Corporate } from "./entities/corporate.entity";

export const entityList = [User, Administrator, Document, JobApplication, EventListing, Recruiter, Corporate];
