import crypto from 'crypto';


// Function to generate a random token and its expiration date
// The token is a random string of 32 bytes converted to hex
export const generateVerificationToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return {
        token,
        expiresAt
    };
};