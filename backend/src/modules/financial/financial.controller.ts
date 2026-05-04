import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  UseGuards, 
  ParseUUIDPipe,
  NotFoundException, 
  BadRequestException,
  ConflictException
} from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { MomoService } from './momo.service';
import { EnrollmentsService } from '../courses/enrollments.service';
import { CoursesService } from '../courses/courses.service';
import { CommunicationsService } from '../communications/communications.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { FinancialService } from './financial.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { TransactionType } from './entities/transaction.entity';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Financial')
@Controller('financial')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FinancialController {
  constructor(
    private readonly financialService: FinancialService,
    private readonly momoService: MomoService,
    private readonly enrollmentsService: EnrollmentsService,
    private readonly coursesService: CoursesService,
    private readonly communicationsService: CommunicationsService
  ) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get current user balance' })
  @ApiResponse({ status: 200, description: 'Return user balance.' })
  async getBalance(@GetUser() user: any) {
    return this.financialService.getBalance(user.id);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Mock endpoint to deposit money' })
  @ApiBody({ schema: { type: 'object', properties: { amount: { type: 'number', example: 500000 } } } })
  async deposit(@Body('amount') amount: number, @GetUser() user: any) {
    // For MVP, auto-complete transaction and update balance
    return this.financialService.deposit(user.id, amount);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Request a withdrawal from balance' })
  @ApiResponse({ status: 201, description: 'Withdrawal request created.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', example: 500000 }
      },
      required: ['amount']
    }
  })
  async requestWithdrawal(
    @Body('amount') amount: number,
    @GetUser() user: any
  ) {
    return this.financialService.requestWithdrawal(user.id, amount);
  }

  @Get('instructor/stats')
  @Roles(UserRole.INSTRUCTOR)
  @ApiOperation({ summary: 'Get revenue statistics for current instructor' })
  async getInstructorStats(@GetUser() user: any) {
    return this.financialService.getInstructorRevenueStats(user.id);
  }

  @Get('instructor/revenue-details')
  @Roles(UserRole.INSTRUCTOR)
  @ApiOperation({ summary: 'Get detailed revenue list for instructor' })
  async getInstructorRevenueDetails(@GetUser() user: any) {
    return this.financialService.getInstructorRevenueDetails(user.id);
  }

  @Get('payout-requests')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'List all pending withdrawal requests (Admin/Manager only)' })
  async getPayoutRequests() {
    return this.financialService.getPendingWithdrawals();
  }

  @Patch('payouts/:id/approve')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve a withdrawal request (Admin only)' })
  @ApiParam({ name: 'id', description: 'UUID of the payout transaction' })
  async approvePayout(@Param('id', ParseUUIDPipe) id: string) {
    return this.financialService.approveWithdrawal(id);
  }

  @Get('my-transactions')
  @ApiOperation({ summary: 'Get current user transaction history' })
  @ApiResponse({ status: 200, description: 'Return all transactions for the user.' })
  async getMyTransactions(@GetUser() user: any) {
    return this.financialService.findByUser(user.id);
  }

  @Get('all-transactions')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'List all platform transactions (Admin/Manager only)' })
  @ApiResponse({ status: 200, description: 'Return all transactions in the system.' })
  async findAll() {
    return this.financialService.findAll();
  }

  @Patch('transactions/:id/complete')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Mark a transaction as completed (Admin only)' })
  @ApiParam({ name: 'id', description: 'UUID of the transaction' })
  async complete(@Param('id', ParseUUIDPipe) id: string) {
    return this.financialService.completeTransaction(id);
  }
  @Patch('transactions/:id/reject')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Mark a transaction as rejected (Admin only)' })
  @ApiParam({ name: 'id', description: 'UUID of the transaction' })
  async reject(@Param('id', ParseUUIDPipe) id: string) {
    return this.financialService.rejectTransaction(id);
  }

  @Post('momo-pay')
  @ApiOperation({ summary: 'Create MoMo payment for course enrollment' })
  @ApiBody({ schema: { type: 'object', properties: { courseId: { type: 'string' } } } })
  async createMomoPayment(@Body('courseId') courseId: string, @GetUser() user: any) {
    const course = await this.coursesService.findOne(courseId);
    if (!course) throw new NotFoundException('Course not found');
    
    // Check if the student is already enrolled
    const existingEnrollments = await this.enrollmentsService.getStudentEnrollments(user.id);
    const isEnrolled = existingEnrollments.some((e: any) => e.courseId === courseId);
    if (isEnrolled) {
      throw new ConflictException('Student is already enrolled in this course');
    }

    const finalPrice = (course.discountPrice && Number(course.discountPrice) > 0) 
      ? Number(course.discountPrice) 
      : Number(course.price);

    // Create new Transaction representing this order
    const transaction = await this.financialService.createTransaction(user.id, finalPrice, TransactionType.PAYMENT);

    const extraData = Buffer.from(JSON.stringify({ courseId, userId: user.id })).toString('base64');
    const orderInfo = `Thanh toan khoa hoc: ${course.title}`.substring(0, 50);

    const momoResponse = await this.momoService.createPaymentQR(transaction.id, finalPrice, orderInfo, extraData);
    
    return {
      ...momoResponse,
      orderCode: (transaction as any).orderCode,
      amount: finalPrice,
    };
  }

  @Public()
  @Post('momo-webhook')
  @ApiOperation({ summary: 'MoMo Payment IPN Webhook' })
  async handleMomoWebhook(@Body() momoData: any) {
    console.log('Received MoMo Webhook IPN:', JSON.stringify(momoData, null, 2));
    
    try {
      const isValid = this.momoService.verifySignature(momoData);
      if (!isValid) {
        throw new BadRequestException('Invalid Signature');
      }

      if (momoData.resultCode === 0) {
        const transactionId = momoData.orderId;
        const paidAmount = Number(momoData.amount);
        
        if (momoData.extraData) {
          const jsonString = Buffer.from(momoData.extraData, 'base64').toString('ascii');
          const { courseId, userId } = JSON.parse(jsonString);
          
          if (courseId && userId) {
            // Process payment and enrollment atomically
            const result = await this.financialService.processMoMoPayment(transactionId, courseId, userId, paidAmount);
            
            if (result.status === 'SUCCESS') {
              const course = await this.coursesService.findOne(courseId);
              // Send success email
              await this.communicationsService.sendPaymentSuccessEmail(userId, course?.title || 'Khóa học', paidAmount);
            }
          }
        }
      } else {
        console.warn(`MoMo Payment failed for order ${momoData.orderId}. ResultCode: ${momoData.resultCode}`);
        await this.financialService.rejectTransaction(momoData.orderId);
      }

      return { status: 204 }; // Success status for MoMo
    } catch (error) {
      console.error('MoMo Webhook Handle Error:', error);
      // Even if there is an error, we should return a success to MoMo to stop it from retrying if it's a logic error
      // But for signature errors, we might want MoMo to know? 
      // MoMo typically expects a response to acknowledge receipt.
      return { status: 204 }; 
    }
  }
}
