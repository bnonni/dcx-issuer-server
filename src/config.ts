import dotenv from 'dotenv';
dotenv.config();

import { PhoneNumberManifest } from './manifests/phone-number.js';

export const config = {
  cursorFile         : 'cursor.json',
  lastRecordIdFile   : 'lastRecordId',
  agentDataPath      : 'DATA/ISSUER/SERVER/AGENT',
  web5Password       : process.env.ISSUER_WEB5_PASSWORD!,
  web5RecoveryPhrase : process.env.ISSUER_WEB5_RECOVERY_PHRASE!,
};

export const phoneNumberProvider =  {
  id       : PhoneNumberManifest.output_descriptors[0].id,
  method   : 'POST',
  endpoint : 'http://localhost:3001/api/auth/phone',
  headers  : { 'Content-Type': 'application/json' }
};