const googleAuthService = require('../services/googleAuthService');
const jwt = require('jsonwebtoken');

exports.googleAuthHandler = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }
    const userData = await googleAuthService.verifyGoogleToken(idToken);

    // numeric for easier calculation on the frontend (e.g., 86400 seconds = 1 day)
    const expiresIn = '86400';
    console.log(userData);
    const token = jwt.sign(
      {
        id: userData.sub,
        email: userData.email,
        name: userData.name,
        picture: userData.picture
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    return res.status(200).json({
      session: { access_token: token, expires_in: expiresIn },
      user: userData
    });
  } catch (error) {
    console.error('Google OAuth Error:', error);
    return res.status(401).json({ error: 'Invalid Google ID token' });
  }
};
