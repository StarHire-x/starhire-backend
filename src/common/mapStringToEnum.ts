import ForumCategoryEnum from '../enums/forumCategory.enum';
import HighestEducationStatusEnum from '../enums/highestEducationStatus.enum';
import JobApplicationStatusEnum from '../enums/jobApplicationStatus.enum';
import NotificationModeEnum from '../enums/notificationMode.enum';
import JobListingStatusEnum from '../enums/jobListingStatus.enum';
import EventListingStatusEnum from '../enums/eventListingStatus.enum';
import TicketCategoryEnum from '../enums/ticketCategory.enum';
import UserRoleEnum from '../enums/userRole.enum';
import UserStatusEnum from '../enums/userStatus.enum';
import VisibilityEnum from '../enums/visibility.enum';
import CorporatePromotionStatusEnum from '../enums/corporatePromotionStatus.enum';

export function mapForumCategoryToEnum(status: string): ForumCategoryEnum {
  switch (status) {
    case 'Job':
      return ForumCategoryEnum.JOB;
    case 'Event':
      return ForumCategoryEnum.EVENT;
    case 'Career':
      return ForumCategoryEnum.CAREER;
    case 'Confession':
      return ForumCategoryEnum.CONFESSION;
    case 'Misc':
      return ForumCategoryEnum.MISC;
  }
}
export function mapEducationStatusToEnum(
  status: string,
): HighestEducationStatusEnum {
  switch (status) {
    case 'No_School':
      return HighestEducationStatusEnum.NO_SCHOOL;
    case 'High_School':
      return HighestEducationStatusEnum.HIGH_SCHOOL;
    case 'Bachelor':
      return HighestEducationStatusEnum.BACHELOR;
    case 'Master':
      return HighestEducationStatusEnum.MASTER;
    case 'Doctorate':
      return HighestEducationStatusEnum.DOCTORATE;
  }
}

export function mapJobApplicationStatusToEnum(
  status: string,
): JobApplicationStatusEnum {
  switch (status) {
    case 'Offer_Accepted':
      return JobApplicationStatusEnum.OFFER_ACCEPTED;
    case 'Submitted':
      return JobApplicationStatusEnum.SUBMITTED;
    case 'To_Be_Submitted':
      return JobApplicationStatusEnum.TO_BE_SUBMITTED;
    case 'Waiting_For_Interview':
      return JobApplicationStatusEnum.WAITING_FOR_INTERVIEW;
    case 'Offer_Rejected':
      return JobApplicationStatusEnum.OFFER_REJECTED;
    case 'Offered':
      return JobApplicationStatusEnum.OFFERED;
    case 'Rejected':
      return JobApplicationStatusEnum.REJECTED;
    default:
      return JobApplicationStatusEnum.PROCESSING;
  }
}

export function mapNotificationModeToEnum(
  status: string,
): NotificationModeEnum {
  switch (status) {
    case 'Sms':
      return NotificationModeEnum.SMS;
    default:
      return NotificationModeEnum.EMAIL;
  }
}

export function mapJobListingStatusToEnum(
  status: string,
): JobListingStatusEnum {
  switch (status) {
    /*
    case 'Inactive':
      return JobListingStatusEnum.INACTIVE;
    case 'Active':
      return JobListingStatusEnum.ACTIVE;
    */
    case 'Approved':
      return JobListingStatusEnum.APPROVED;
    case 'Rejected':
      return JobListingStatusEnum.REJECTED;
    case 'Archived':
      return JobListingStatusEnum.ARCHIVED;
    default:
      return JobListingStatusEnum.UNVERIFIED;
  }
}

export function mapEventListingStatusToEnum(
  status: string,
): EventListingStatusEnum {
  switch (status) {
    case 'Expired':
      return EventListingStatusEnum.EXPIRED;
    case 'Cancelled':
      return EventListingStatusEnum.CANCELLED;
    default:
      return EventListingStatusEnum.UPCOMING;
  }
}

export function mapTicketCategoryToEnum(status: string): TicketCategoryEnum {
  switch (status.toLowerCase()) {
    case 'general':
      return TicketCategoryEnum.GENERAL;
    case 'account':
      return TicketCategoryEnum.ACCOUNT;
    case 'jobs':
      return TicketCategoryEnum.JOBS;
    case 'events':
      return TicketCategoryEnum.EVENTS;
    case 'forum':
      return TicketCategoryEnum.FORUM;
    case 'subscriptionbilling':
      return TicketCategoryEnum.SUBSCRIPTION_BILLING;
    default:
      return null;
  }
}

export function mapUserRoleToEnum(status: string): UserRoleEnum {
  switch (status.toLowerCase()) {
    case 'recruiter':
      return UserRoleEnum.RECRUITER;
    case 'corporate':
      return UserRoleEnum.CORPORATE;
    case 'administrator':
      return UserRoleEnum.ADMINISTRATOR;
    case 'job_seeker':
      return UserRoleEnum.JOBSEEKER;
    default:
      return null;
  }
}

export function mapUserStatusToEnum(status: string): UserStatusEnum {
  switch (status) {
    case 'Inactive':
      return UserStatusEnum.INACTIVE;
    default:
      return UserStatusEnum.ACTIVE;
  }
}

export function mapVisibilityToEnum(status: string): VisibilityEnum {
  switch (status) {
    case 'Limited':
      return VisibilityEnum.LIMITED;
    default:
      return VisibilityEnum.PUBLIC;
  }
}

export function mapCorporatePromotionStatusEnum(
  status: string,
): CorporatePromotionStatusEnum {
  switch (status) {
    case 'Regular':
      return CorporatePromotionStatusEnum.REGULAR;
    case 'Premium':
      return CorporatePromotionStatusEnum.PREMIUM;
    case 'Requested':
      return CorporatePromotionStatusEnum.REQUESTED;
    default:
      return CorporatePromotionStatusEnum.REGULAR;
  }
}
