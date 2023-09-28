import ForumCategoryEnum from 'src/enums/forumCategory.enum';
import HighestEducationStatusEnum from 'src/enums/highestEducationStatus.enum';
import JobApplicationStatusEnum from 'src/enums/jobApplicationStatus.enum';
import NotificationModeEnum from 'src/enums/notificationMode.enum';
import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';
import StarCategoryEnum from 'src/enums/starCategory.enum';
import TicketCategoryEnum from 'src/enums/ticketCategory.enum';
import UserRoleEnum from 'src/enums/userRole.enum';
import UserStatusEnum from 'src/enums/userStatus.enum';
import VisibilityEnum from 'src/enums/visibility.enum';

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
    case 'Accepted':
      return JobApplicationStatusEnum.ACCEPTED;
    case 'Submitted':
      return JobApplicationStatusEnum.SUBMITTED;
    case 'Waiting_For_Interview':
      return JobApplicationStatusEnum.WAITING_FOR_INTERVIEW;
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

export function mapStarCategoryToEnum(status: string): StarCategoryEnum {
  switch (status) {
    case 'ONE_STAR':
      return StarCategoryEnum.ONE_STAR;
    case 'TWO_STAR':
      return StarCategoryEnum.TWO_STAR;
    case 'THREE_STAR':
      return StarCategoryEnum.THREE_STAR;
    case 'FOUR_STAR':
      return StarCategoryEnum.FOUR_STAR;
    default:
      return StarCategoryEnum.FIVE_STAR;
  }
}

export function mapTicketCategoryToEnum(status: string): TicketCategoryEnum {
  switch (status.toLowerCase()) {
    case 'event':
      return TicketCategoryEnum.EVENT;
    case 'joblisting':
      return TicketCategoryEnum.JOBLISTING;
    case 'chat':
      return TicketCategoryEnum.CHAT;
    case 'website':
      return TicketCategoryEnum.WEBSITE;
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
