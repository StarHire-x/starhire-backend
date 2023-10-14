enum ForumPostEnum {
    Active = 'Active',
    Pending = 'Pending',
    Inactive = 'Inactive', // only when admin takes down the post
    Reported = 'Reported',
    Deleted = 'Deleted' // only when job seeker deletes their own posts, then will be in this status
  }
  
  export default ForumPostEnum;
  