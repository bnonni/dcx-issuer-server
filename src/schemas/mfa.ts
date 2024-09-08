export const schema = {
  "$id": "https://dcxprotocol.com/.well-known/schema/mfa.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MFA DWN Record Schema",
  "description": "DWN record schema used to store information about MFA for phone or email verification",
  "type": "object",
  "properties": {
      "otp": {
          "type": "string",
          "pattern": "^[0-9]{6}$"
      },
      "phone": {
          "type": "string",
          "pattern": "^\\d{10}$"
      },
      "email": {
          "type": "string",
          "pattern": "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
      }
  },
  "oneOf": [
      {
          "required": [
              "phone"
          ]
      },
      {
          "required": [
              "email"
          ]
      }
  ],
  "required": [
      "otp"
  ],
  "additionalProperties": false
}