import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OwnCartGuard implements CanActivate {
  constructor(private prisma: PrismaService) { }
  /**
   * this guard prevents a user from accessing other user cart
  */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest()
    const cartId = Number(params.cartId)

    if (!cartId) throw new BadRequestException()

    const userCart = await this.prisma.cart.findUnique({
      where: {
        id: cartId,
      }
    })

    if (!userCart) {
      throw new ForbiddenException()
    }

    if (userCart.userId !== user.id) {
      throw new ForbiddenException()
    }
    return true;
  }
}
