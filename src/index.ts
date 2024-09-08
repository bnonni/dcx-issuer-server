import { DwnUtils, Logger, RequestCredentialParams } from '@dcx-protocol/common';
import { DcxIssuer, issuerConfig } from '@dcx-protocol/issuer';
import { DcxServer } from '@dcx-protocol/server';
import { VerifiableCredential } from '@web5/credentials';
import { config as dcxConfig } from './config.js';
import { protocol as mfa } from './protocols/mfa.js';
import { schema as mfaSchema } from './schemas/mfa.js';

import Sendgrid from '@sendgrid/mail';
import Twilio from 'twilio';
import { PhoneNumberManifest } from './manifests/phone-number.js';

export type PhoneAuthToken = { otp: string };

const { issuerServer: server, issuer } = new DcxServer({
  type   : 'issuer',
  issuer : new DcxIssuer({ config: { ...issuerConfig, ...dcxConfig } })
});

const otpConfig = {
  twilio: {
    fromNumber : process.env.TWILIO_FROM_NUMBER,
    accountSid : process.env.TWILIO_ACCOUNT_SID,
    authToken  : process.env.TWILIO_AUTH_TOKEN,
  },
  sendgrid: {
    apikey: process.env.SENDGRID_API_KEY
  }
};

Sendgrid.setApiKey(otpConfig.sendgrid.apikey!);

const twilio = Twilio(otpConfig.twilio.accountSid, otpConfig.twilio.authToken);

export const randomOtp = (phone: string) => phone === '5555555555'
  ? '123456'
  : Math.random().toString().slice(2, 8).padStart(6, '0');

export async function sendOtp(phone: string): Promise<PhoneAuthToken> {
  Logger.debug(`Phone ${phone} POST /api/auth/phone`);
  const authToken = { phone, otp: randomOtp(phone) };
  if(phone === '5555555555') {
    authToken.otp = '123456';
    return authToken;
  }
  await twilio.messages.create({
    body : 'Your login code is: ' + authToken.otp,
    from : `${otpConfig.twilio.fromNumber}`,
    to   : `+1${phone}`,
  });
  return authToken;
}

export async function requestEmailAddressCredential() {
  Logger.error('Not implemented');
}

export async function requestPhoneNumberCredential(body: { vcs: VerifiableCredential[], data: any } | any): Promise<any> {
  const phoneVc = body.vcs[0].vcDataModel;
  const phone = phoneVc.credentialSubject.phoneNumber;

  const { otp } = await sendOtp(phone);
  Logger.debug(`Sent otp ${otp} to phone number ${phone}`);
  const { record, status: create } = await issuer.web5.dwn.records.create({
    store   : true,
    data    : { phone, otp },
    message : {
      published    : true,
      protocolPath : 'mfa',
      protocol     : mfa.protocol,
      schema       : mfaSchema.$id,
      dataFormat   : 'application/json',
    },
  });

  if(!record) {
    Logger.error('Failed to create otp record', create);
    return;
  }

  const { status: send } = await record.send();
  if (DwnUtils.isFailure(send.code)) {
    Logger.error('Failed to send dwn otp record', send);
    return { status: send, record };
  }

  Logger.debug(`Sent otp record to remote dwn`, send);
  return { status: send, record };
}

export async function requestMfaCredentialData({ body: { vcs } }: RequestCredentialParams): Promise<any> {
  const phoneVc = vcs.find(
    (vc: VerifiableCredential) => vc.vcDataModel.type.filter(
      (type: string) => type === 'PhoneNumberCredential')
  );

  const emailVc = vcs.find(
    (vc: VerifiableCredential) => vc.vcDataModel.type.filter(
      (type: string) => type === 'EmailAddressCredential')
  );

  if (phoneVc) {
    return requestPhoneNumberCredential(vcs);
  } else if (emailVc) {
    return requestEmailAddressCredential();
  } else {
    Logger.error('Unknown VC type ... skipping');
  }
}

server.use('handlers', { id: 'requestCredentialData', handler: requestMfaCredentialData });
server.use('providers', PhoneNumberManifest);

issuer.config.dwns = ['http://localhost:3000'];

await issuer.initialize();
await issuer.setup();
await server.listen({ ms: '30s' });

process.on('SIGTERM', () => {
  server.stop();
});