const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const googleAuthHandler =
  require('../controllers/googleAuthController').googleAuthHandler;
const googleAuthService = require('../services/googleAuthService');

// We mock the googleAuthService to control its behavior in controller tests
jest.mock('../services/googleAuthService');

describe('GoogleAuthController', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
    jest.clearAllMocks();
  });

  it('should return 400 if no idToken provided', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/auth/google',
      body: {} // no idToken
    });
    const res = httpMocks.createResponse();

    await googleAuthHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: 'ID token is required' });
  });

  it('should return 200 and valid payload on successful verification', async () => {
    const fakeToken = 'fake-token';
    const fakeUserData = {
      sub: '123',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'http://example.com/pic.jpg'
    };

    googleAuthService.verifyGoogleToken.mockResolvedValue(fakeUserData);

    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/auth/google',
      body: { idToken: fakeToken }
    });
    const res = httpMocks.createResponse();

    // Spy on jwt.sign to check its arguments
    const jwtSignSpy = jest.spyOn(jwt, 'sign');

    await googleAuthHandler(req, res);

    expect(googleAuthService.verifyGoogleToken).toHaveBeenCalledWith(fakeToken);
    expect(jwtSignSpy).toHaveBeenCalledWith(
      {
        id: fakeUserData.sub,
        email: fakeUserData.email,
        name: fakeUserData.name,
        picture: fakeUserData.picture
      },
      process.env.JWT_SECRET,
      { expiresIn: '86400' }
    );

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty('session');
    expect(data).toHaveProperty('user');
    expect(data.user).toEqual(fakeUserData);
    expect(data.session).toHaveProperty('access_token');
    expect(data.session).toHaveProperty('expires_in', '86400');
  });

  it('should return 401 on error during token verification', async () => {
    const fakeToken = 'invalid-token';
    googleAuthService.verifyGoogleToken.mockRejectedValue(
      new Error('Invalid token')
    );

    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/auth/google',
      body: { idToken: fakeToken }
    });
    const res = httpMocks.createResponse();

    await googleAuthHandler(req, res);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ error: 'Invalid Google ID token' });
  });
});
