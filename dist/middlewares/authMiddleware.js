import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
export function checkAuth(req, res, next) {
    console.log('checkAuth middleware - start');
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log('checkAuth middleware - no authorization header');
        return res.status(401).json({ error: "Unauthorized. No authorization header provided." });
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        console.log('checkAuth middleware - invalid authorization header format');
        return res.status(401).json({ error: "Unauthorized. Invalid authorization header format." });
    }
    const token = parts[1];
    console.log('Token received:', token);
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.user = decodedToken;
        console.log('checkAuth middleware - token verified, user:', decodedToken);
        next();
    }
    catch (error) {
        console.error('checkAuth middleware - token error', error);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: "Unauthorized. Token has expired." });
        }
        return res.status(403).json({ error: "Access forbidden. Invalid token." });
    }
}
export function checkRole(roles) {
    return function (req, res, next) {
        if (!req.user) {
            console.log('checkRole middleware - no user');
            return res.status(401).json({ error: "Unauthorized. User not authenticated." });
        }
        if (!roles.includes(req.user.role)) {
            console.log('checkRole middleware - insufficient role');
            return res.status(403).json({ error: "Access forbidden. User doesn't have the required role" });
        }
        console.log('checkRole middleware - role check passed');
        next();
    };
}
export const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url} [STARTED]`);
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} [FINISHED] - ${duration} ms - Status: ${res.statusCode}`);
    });
    res.on('close', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} [CLOSED] - ${duration} ms - Status: ${res.statusCode}`);
    });
    next();
};
export default { checkAuth, checkRole, logger };
