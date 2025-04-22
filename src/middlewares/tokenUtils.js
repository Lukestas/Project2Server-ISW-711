import crypto from 'crypto';

export const generateVerificationToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return {
        token,
        expiresAt
    };
};