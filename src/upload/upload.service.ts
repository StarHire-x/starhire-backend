import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(private readonly configService: ConfigService) {}

  async upload(fileName: string, file: Buffer) {
    const contentType = this.getContentTypeByFile(fileName);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'starhire-uploader',
        Key: fileName,
        Body: file,
        ContentType: contentType
      }),
    );

    const s3Url = `https://starhire-uploader.s3.${this.configService.getOrThrow(
      'AWS_S3_REGION',
    )}.amazonaws.com/${fileName}`;

    console.log(s3Url);

    return { url: s3Url };
  }

  private getContentTypeByFile(fileName: string): string {
    const fileExtension = fileName.split(".").pop().toLowerCase();

    console.log("File type")
    console.log(fileExtension)
    switch (fileExtension) {
        case 'jpeg':
        case 'jpg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'pdf':
            return 'application/pdf';
        // Add other file extensions and MIME types as needed
        default:
            return 'application/octet-stream'; // Fallback to binary if unknown type
    }
  }
}
