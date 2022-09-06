import { Controller } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('')
export class VerificationController {
    constructor(private verificationService: VerificationService) {}
}
