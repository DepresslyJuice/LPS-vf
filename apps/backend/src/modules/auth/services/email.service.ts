import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { getPasswordRecoveryTemplate } from '../templates/password-recovery.template';
import { getPasswordChangedTemplate } from '../templates/password-changed.template';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EmailService {
  private readonly logoPngUTN = `data:image/png;base64,${readFileSync(
    join(process.cwd(), 'src', 'assets', 'ieee-utn-color.png'),
  ).toString('base64')}`;

  private readonly logoPngUnificado = `data:image/png;base64,${readFileSync(
    join(process.cwd(), 'src', 'assets', 'unificado.png'),
  ).toString('base64')}`;

  private readonly logger = new Logger(EmailService.name);
  private smtpTransporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initializeEmailProvider();
  }

  /**
   * Inicializa el proveedor de email SMTP (Nodemailer).
   * Si no hay credenciales configuradas, los emails se muestran en consola (modo desarrollo).
   */
  private initializeEmailProvider(): void {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (smtpHost && smtpUser && smtpPass) {
      // ConfigService devuelve strings del .env, así que parseamos manualmente
      // para evitar que 'false' (string truthy) active SSL incorrectamente
      const smtpPort = parseInt(
        this.configService.get<string>('SMTP_PORT', '587').trim(),
        10,
      );
      const smtpSecure =
        this.configService.get<string>('SMTP_SECURE', 'false').trim().toLowerCase() === 'true';

      try {
        this.smtpTransporter = nodemailer.createTransport({
          host: smtpHost.trim(),
          port: smtpPort,
          secure: smtpSecure,   // false → STARTTLS en puerto 587 | true → SSL en puerto 465
          auth: { user: smtpUser.trim(), pass: smtpPass.trim() },
          tls: {
            rejectUnauthorized: false,
          },
        });
        this.logger.log(`✅ Email service inicializado con SMTP: ${smtpHost}:${smtpPort}`);
      } catch (error) {
        this.logger.error('❌ Error al inicializar SMTP transporter:', error);
      }
      return;
    }

    // Sin credenciales: modo consola
    this.logger.warn(
      '⚠️  Sin credenciales SMTP configuradas. Los emails se mostrarán en consola.\n' +
      '   → Configura SMTP_HOST, SMTP_USER y SMTP_PASS en el archivo .env',
    );
  }

  /**
   * Envía el código de recuperación de contraseña
   */
  async sendPasswordRecoveryCode(
    email: string,
    code: string,
    nombre: string,
  ): Promise<void> {
    const html = getPasswordRecoveryTemplate(nombre, code, this.logoPngUnificado);

    try {
      if (this.smtpTransporter) {
        const emailFrom = this.configService.get<string>('EMAIL_FROM', 'noreply@app.com');
        await this.smtpTransporter.sendMail({
          from: emailFrom,
          to: email,
          subject: 'Recuperación de contraseña',
          html,
        });
        this.logger.log(`📧 Email de recuperación enviado a: ${email} (via SMTP)`);
        return;
      }

      // Sin proveedor configurado: loguear en consola
      this.logEmailToConsole(email, nombre, code, 'recuperación');
      throw new Error('Sin proveedor de email configurado');

    } catch (error) {
      this.logger.error('❌ Error al enviar email de recuperación:', error);
      this.logEmailToConsole(email, nombre, code, 'recuperación');
      throw new Error('No se pudo enviar el email de recuperación');
    }
  }

  /**
   * Envía confirmación de cambio de contraseña exitoso
   */
  async sendPasswordChangedConfirmation(
    email: string,
    nombre: string,
  ): Promise<void> {
    const html = getPasswordChangedTemplate(nombre, this.logoPngUTN);

    try {
      if (this.smtpTransporter) {
        const emailFrom = this.configService.get<string>('EMAIL_FROM', 'noreply@app.com');
        await this.smtpTransporter.sendMail({
          from: emailFrom,
          to: email,
          subject: 'Contraseña actualizada exitosamente',
          html,
        });
        this.logger.log(`📧 Email de confirmación enviado a: ${email} (via SMTP)`);
        return;
      }

      this.logEmailToConsole(email, nombre, '', 'confirmación');

    } catch (error) {
      this.logger.error('❌ Error al enviar email de confirmación:', error);
      // No lanzar error aquí, la contraseña ya fue cambiada
    }
  }

  /**
   * Loguea el email en consola cuando no hay proveedor configurado
   */
  private logEmailToConsole(
    email: string,
    nombre: string,
    code: string,
    tipo: 'recuperación' | 'confirmación',
  ): void {
    this.logger.log(`
      ═══════════════════════════════════════════════════════════
      📧 EMAIL DE ${tipo.toUpperCase()} (MODO DESARROLLO)
      ═══════════════════════════════════════════════════════════
      Para: ${email}
      Nombre: ${nombre}
      ${code ? `Código: ${code}` : 'Tipo: Confirmación de cambio de contraseña'}
      ═══════════════════════════════════════════════════════════
      ⚠️  Configura SMTP_HOST, SMTP_USER y SMTP_PASS para enviar emails reales
      ═══════════════════════════════════════════════════════════
    `);
  }

  /**
   * Verifica la conexión SMTP
   */
  async verifyConnection(): Promise<boolean> {
    if (this.smtpTransporter) {
      try {
        await this.smtpTransporter.verify();
        this.logger.log('✅ Conexión SMTP verificada exitosamente');
        return true;
      } catch (error) {
        this.logger.error('❌ Error al verificar conexión SMTP:', error);
        return false;
      }
    }
    this.logger.warn('No hay proveedor de email configurado');
    return false;
  }
}