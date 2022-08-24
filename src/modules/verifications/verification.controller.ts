import { Controller } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('user')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}
}
