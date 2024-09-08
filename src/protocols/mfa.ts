export const protocol = {
  "protocol": "https://dcxprotocol.com/.well-known/protocol/mfa.json",
  "published": true,
  "types": {
      "mfa": {
          "schema": "https://dcxprotocol.com/.well-known/schema/mfa.json",
          "dataFormats": [
              "application/json"
          ]
      }
  },
  "structure": {
      "mfa": {
          "phone": {
              "$actions": [
                  {
                      "who": "recipient",
                      "of": "mfa",
                      "can": [
                          "read"
                      ]
                  }
              ]
          },
          "email": {
              "$actions": [
                  {
                      "who": "recipient",
                      "of": "mfa",
                      "can": [
                          "read"
                      ]
                  }
              ]
          },
          "otp": {
              "$actions": [
                  {
                      "who": "author",
                      "of": "mfa",
                      "can": [
                          "read"
                      ]
                  },
                  {
                      "who": "recipient",
                      "of": "mfa",
                      "can": [
                          "create",
                          "read",
                          "update",
                          "delete"
                      ]
                  }
              ]
          },
      }
  }
}