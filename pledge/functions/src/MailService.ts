import * as SendGrid from '@sendgrid/mail'
import * as functions from 'firebase-functions'

export interface EmailService {
  send(templateId: string, to: string,
       vars: { [_: string]: any }): Promise<void>
}

export class SendGridEmailService implements EmailService {

  constructor() {
    SendGrid.setApiKey(`${functions.config().sendgrid.key}`)
  }
  send(templateId: string, to: string,
       vars: { [_: string]: any }): Promise<void> {
    return sendEmail(templateId, to, vars)
  }
}

export async function sendEmail(templateId: string, to: string,
                                vars: { [_: string]: any }): Promise<void> {
  console.log('sendEmail to ', to, functions.config().sendgrid)
  const msg = {
    to,
    templateId,
    from: 'no-reply@oneworldmarathon.org',
    subject: 'Welcome to One World Marathon',
    text: 'Hello plain world!',
    html: '<p>Hello HTML world!</p>',

    dynamic_template_data: vars,
  }
  console.log('Sending ...', msg)
  const response = await SendGrid.send(msg)
  console.log('sendGrid response', response)
}
