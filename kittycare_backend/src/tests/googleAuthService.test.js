const { OAuth2Client } = require('google-auth-library');

// We override the OAuth2Client to use a mocked prototype
jest.mock('google-auth-library', () => {
  const mOAuth2Client = jest.fn();
  mOAuth2Client.prototype.verifyIdToken = jest.fn();
  return { OAuth2Client: mOAuth2Client };
});

const googleAuthService = require('../services/googleAuthService');

describe('GoogleAuthService', () => {
  beforeEach(() => {
    process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
    jest.clearAllMocks();
  });

  describe('verifyGoogleToken', () => {
    it('should return payload if token is valid', async () => {
      const fakeToken = 'fake-token';
      const fakePayload = {
        sub: '123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'http://example.com/pic.jpg'
      };

      // Mock the prototype method
      OAuth2Client.prototype.verifyIdToken.mockResolvedValue({
        getPayload: () => fakePayload
      });

      const payload = await googleAuthService.verifyGoogleToken(fakeToken);

      expect(OAuth2Client.prototype.verifyIdToken).toHaveBeenCalledWith({
        idToken: fakeToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      expect(payload).toEqual(fakePayload);
    });

    it('should throw error if token is invalid', async () => {
      const fakeToken = 'invalid-token';
      const error = new Error('Invalid token');

      OAuth2Client.prototype.verifyIdToken.mockRejectedValue(error);

      await expect(googleAuthService.verifyGoogleToken(fakeToken))
        .rejects
        .toThrow('Invalid token');
    });
  });
});
