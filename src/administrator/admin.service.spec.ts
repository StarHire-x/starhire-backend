import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorService } from './admin.service';
import { EmailService } from '../email/email.service';
import { TwilioService } from '../twilio/twilio.service';
import { Administrator } from '../entities/administrator.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import NotificationModeEnum from '../enums/notificationMode.enum';
import UserRoleEnum from '../enums/userRole.enum';
import UserStatusEnum from '../enums/userStatus.enum';
import { CreateAdministratorDto } from './dto/create-admin.dto';
import { UpdateAdministratorDto } from './dto/update-admin.dto';

describe('AdministratorsService', () => {
  let adminService: AdministratorService;
  let emailService: EmailService;
  let twilioService: TwilioService;
  let adminRepository: Repository<Administrator>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdministratorService,
        {
          provide: getRepositoryToken(Administrator),
          useClass: Repository,
        },
        {
          provide: EmailService,
          useClass: jest.fn(() => ({
            sendNotificationStatusEmail: jest.fn().mockResolvedValue({
              statusCode: HttpStatus.OK,
              message: 'Notification status email sent successfully',
              data: [],
            }),
          })),
        },
        {
          provide: TwilioService,
          useClass: jest.fn(() => ({
            sendNotificationStatusSMS: jest.fn().mockResolvedValue({
              statusCode: HttpStatus.OK,
              message: 'SMS successfully sent',
              data: [],
            }),
          })),
        },
      ],
    }).compile();

    adminService = module.get<AdministratorService>(AdministratorService);
    emailService = module.get<EmailService>(EmailService);
    twilioService = module.get<TwilioService>(TwilioService);
    adminRepository = module.get<Repository<Administrator>>(
      getRepositoryToken(Administrator),
    );
  });

  it('should be defined', () => {
    expect(adminService).toBeDefined();
    expect(emailService).toBeDefined();
    expect(twilioService).toBeDefined();
    expect(adminRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a admin and return the created admin', async () => {
      const createAdminDto: CreateAdministratorDto = {
        userName: 'adminTest',
        email: 'admin@gmail.com',
        password: 'securepassword',
        contactNo: '555-1234',
        status: UserStatusEnum.ACTIVE,
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.ADMINISTRATOR,
        fullName: 'Man Tan',
        profilePictureUrl: 'https://example.com/profile-picture.jpg',
      };

      const admin = new Administrator({
        userName: 'adminTest',
        email: 'admin@gmail.com',
        password: 'securepassword',
        contactNo: '555-1234',
        status: UserStatusEnum.ACTIVE,
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.ADMINISTRATOR,
        fullName: 'Man Tan',
        profilePictureUrl: 'https://example.com/profile-picture.jpg',
      });

      jest.spyOn(adminRepository, 'save').mockResolvedValueOnce(admin);

      const result = await adminService.create(createAdminDto);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Admin created',
        data: admin,
      });
    });

    it('should throw an error if email is missing', async () => {
      const createAdminDto: CreateAdministratorDto = {
        userName: 'adminTest',
        password: 'securepassword',
        contactNo: '555-1234',
        status: UserStatusEnum.ACTIVE,
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.ADMINISTRATOR,
        fullName: 'Man Tan',
        profilePictureUrl: 'https://example.com/profile-picture.jpg',
        email: ''
      };

      await expect(adminService.create(createAdminDto)).rejects.toThrow(
        'Failed to create new administrator',
      );
    });

    it('should throw an error if creation fails', async () => {
      const createAdminDto: CreateAdministratorDto = {
        userName: 'adminTest',
        email: 'admin@gmail.com',
        password: 'securepassword',
        contactNo: '555-1234',
        status: null,
        notificationMode: NotificationModeEnum.EMAIL,
        createdAt: new Date(),
        role: UserRoleEnum.ADMINISTRATOR,
        fullName: 'Man Tan',
        profilePictureUrl: 'https://example.com/profile-picture.jpg',
      };

      jest
        .spyOn(adminRepository, 'save')
        .mockRejectedValueOnce(new Error('Failed to create new administrator'));

      await expect(adminService.create(createAdminDto)).rejects.toThrow(
        'Failed to create new administrator',
      );
    });
  });

  describe('findAll', () => {
    it('should return all admins if there are any', async () => {
      const admin1 = new Administrator({
        userId: 'admin1',
      });
      const admin2 = new Administrator({
        userId: 'admin2',
      });
      const admins = [admin1, admin2];

      jest.spyOn(adminRepository, 'find').mockResolvedValueOnce(admins);

      const result = await adminService.findAll();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Admin found',
        data: admins,
      });
    });

    it('should return not found if there are no admins', async () => {
      jest.spyOn(adminRepository, 'find').mockResolvedValueOnce([]);

      const result = await adminService.findAll();

      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Admin not found',
        data: [],
      });
    });

    it('should throw an error if finding admins fails', async () => {
      jest
        .spyOn(adminRepository, 'find')
        .mockRejectedValueOnce(new Error('Failed to find admin'));

      await expect(adminService.findAll()).rejects.toThrow(
        'Failed to find admin',
      );
    });
  });

  describe('findOne', () => {
    it('should return admin if id exists', async () => {
      const id = '1234';
      const admin = new Administrator({ userId: id, tickets: [] });
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(admin);

      const result = await adminService.findOne(id);

      expect(result).toEqual(admin);
    });

    it('should throw error if findOne fails', async () => {
      const id = '1234';
      jest
        .spyOn(adminRepository, 'findOne')
        .mockRejectedValue(new Error('Failed to find administrator'));

      await expect(adminService.findOne(id)).rejects.toThrow(
        new HttpException(
          'Failed to find administrator',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('findByEmail', () => {
    it('should return admin if email exists', async () => {
      const email = 'test@example.com';
      const admin = new Administrator({ email });
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(admin);

      const result = await adminService.findByEmail(email);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Admin found',
        data: admin,
      });
    });

    it('should return not found if email does not exist', async () => {
      const email = 'test@example.com';
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(null);

      const result = await adminService.findByEmail(email);

      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Admin not found',
      });
    });

    it('should throw error if findOne fails', async () => {
      const email = 'test@example.com';
      jest
        .spyOn(adminRepository, 'findOne')
        .mockRejectedValue(new Error('Failed to find recruiter'));

      await expect(adminService.findByEmail(email)).rejects.toThrow(
        new HttpException(
          'An error occurred while trying to find the admin',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('findByUserId', () => {
    it('should return admin if userId exists', async () => {
      const userId = '1234';
      const admin = new Administrator({ userId });
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(admin);

      const result = await adminService.findByUserId(userId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Admin found',
        data: admin,
      });
    });

    it('should return not found if userId does not exist', async () => {
      const userId = '1234';
      jest.spyOn(adminRepository, 'findOne').mockResolvedValue(null);

      const result = await adminService.findByUserId(userId);

      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Admin not found',
      });
    });

    it('should throw error if findOne fails', async () => {
      const userId = '1234';
      jest
        .spyOn(adminRepository, 'findOne')
        .mockRejectedValue(new Error('An error occurred while trying to find the admin'));

      await expect(adminService.findByUserId(userId)).rejects.toThrow(
        new HttpException('An error occurred while trying to find the admin', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('update', () => {
    it('should update admin and return updated admin', async () => {
      const id = '1234';
      const updatedAdmin = new UpdateAdministratorDto({
        notificationMode: 'SMS',
      });
      const admin = new Administrator({
        userId: id,
        notificationMode: NotificationModeEnum.SMS,
      });

      jest.spyOn(adminRepository, 'findOneBy').mockResolvedValue(admin);
      jest
        .spyOn(adminRepository, 'save')
        .mockResolvedValue({ ...admin, ...updatedAdmin });

      const result = await adminService.update(id, updatedAdmin);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Administrator updated',
        data: { ...admin, ...updatedAdmin },
      });
    });

    it('should return not found if admin id does not exist', async () => {
      const id = '1234';
      const updatedAdmin = new UpdateAdministratorDto({
        notificationMode: 'EMAIL',
      });

      jest.spyOn(adminRepository, 'findOneBy').mockResolvedValue(null);

      const result = await adminService.update(id, updatedAdmin);

      expect(result).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Administrator not updated',
        data: [],
      });
    });

    it('should throw bad request exception if an error occurs', async () => {
      const id = '1234';
      const updatedAdmin = new UpdateAdministratorDto({
        notificationMode: 'EMAIL',
      });

      jest
        .spyOn(adminRepository, 'findOneBy')
        .mockRejectedValue(new Error('Failed to update administrator'));

      await expect(adminService.update(id, updatedAdmin)).rejects.toThrow(
        new HttpException(
          'Failed to update administrator',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('remove', () => {
    it('should remove a admin and return the result', async () => {
      const id = 'someUserId';
      const result = new DeleteResult();
      result.affected = 1;
      result.raw = {};
      jest.spyOn(adminRepository, 'delete').mockResolvedValue(result);
      const response = await adminService.remove(id);
      expect(response).toEqual(result);
    });

    it('should throw a not found exception if admin is not found', async () => {
      const id = 'someUserId';
      const result = new DeleteResult();
      result.affected = 0;
      result.raw = {};
      jest.spyOn(adminRepository, 'delete').mockResolvedValue(result);
      await expect(adminService.remove(id)).rejects.toThrow(
        new HttpException('Admin id not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw a bad request exception if there is a database error', async () => {
      const id = 'someUserId';
      jest
        .spyOn(adminRepository, 'delete')
        .mockRejectedValue(new Error('Database error'));
      await expect(adminService.remove(id)).rejects.toThrow(
        new HttpException('Database error', HttpStatus.BAD_REQUEST),
      );
    });
  });


});
