export const PhoneNumberManifest = {
  "id": "phone-number-mfa-manifest:68cf3dca2457d5c720cb6dd06d08ae5c",
  "spec_version": "https://identity.foundation/credential-manifest/spec/v1.0.0/",
  "issuer": {
      "id": "",
      "name": "",
      "styles": {
          "thumbnail": {
              "uri": "https://dcxprotocol.com/images/thumbnail.jpg",
              "alt": ""
          },
          "hero": {
              "uri": "https://dcxprotocol.com/images/hero.jpg",
              "alt": ""
          },
          "background": {
              "color": "#FFFFFF"
          },
          "text": {
              "color": "#000000"
          }
      }
  },
  "output_descriptors": [
      {
          "id": "phone-number-credential",
          "name": "Phone Number Credential",
          "schema": "https://dcxprotocol.com/.well-known/credential/PhoneNumberCredential.json"
      }
  ],
  "format": {
      "jwt": {
          "alg": [
              "EdDSA"
          ]
      }
  },
  "presentation_definition": {
      "id": "phone-number-presentation",
      "name": "Phone Number Presentation",
      "purpose": "Used to present proof that an applicant owns the enclosed phone number by providing the enclosed one-time password (otp)",
      "input_descriptors": [
          {
              "id": "phone-number-input-descriptor",
              "purpose": "The holder of this credential has proven ownership of the enclosed phone number by providing the correct one-time password (otp)",
              "constraints": {
                  "fields": [
                      {
                          "path": [
                              "$.credentialSubject.phoneNumber",
                              "$.credentialSubject.otp"
                          ]
                      }
                  ]
              }
          }
      ]
  }
}