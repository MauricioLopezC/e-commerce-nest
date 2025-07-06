import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as brevo from '@getbrevo/brevo';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../orders/events/order-created.envent';
import { PrismaService } from 'src/prisma/prisma.service';
import e from 'express';

@Injectable()
export class MailsService {
  private apiInstance: brevo.TransactionalEmailsApi;
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {
    this.apiInstance = new brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(0, config.get<'string'>('BREVO_API_KEY'))

  }

  async sendOrderConfirmation(to: string, orderId: string): Promise<boolean> {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = '✅ ¡Orden confirmada!';
    sendSmtpEmail.htmlContent = `
      <h1>Gracias por tu compra</h1>
      <p>Tu orden #${orderId} ha sido procesada.</p>
    `;
    sendSmtpEmail.sender = {
      email: this.config.get<string>('GMAIL_USER'),
      name: 'MartinaML'
    };
    sendSmtpEmail.to = [{ email: to }];

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return true;
    } catch (error) {
      console.error('Error al enviar email:', error);
      return false;
    }
  }

  @OnEvent('order.created')
  async handleOrderConfirmationEvent(event: OrderCreatedEvent) {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    const order = await this.prisma.order.findUnique({
      where: {
        id: event.orderId
      }
    })

    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        orderId: event.orderId
      },
      include: {
        product: true
      }
    })
    const itemsList = orderItems.map((item) => (
      `<li>${item.product.name} x ${item.quantity}</li>`
    ))

    sendSmtpEmail.subject = '✅ ¡Orden confirmada!';
    sendSmtpEmail.htmlContent = `
      <h1>Gracias por tu compra</h1>
      <p>Tu orden #${event.orderId} ha sido procesada.</p>
      <p>Pueder buscar la orden por su id en el apartado de compras de la aplicación.</p>
      <p>Resumen.</p>
      <ul>${itemsList}</ul>
      <p>Subtotal: ${order.total} </p>
      <p>Descuento: ${order.discountAmount} </p>
      <p>TOTAL: ${order.finalTotal} </p>
      `;
    sendSmtpEmail.sender = {
      email: this.config.get<string>('GMAIL_USER'),
      name: 'MartinaML'
    };

    const user = await this.prisma.user.findUnique({
      where: {
        id: event.userId
      }
    })

    sendSmtpEmail.to = [{ email: user.email }];

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
      console.error('Error al enviar email:', error);
    }

  }




}

