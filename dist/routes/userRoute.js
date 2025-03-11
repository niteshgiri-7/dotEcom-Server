import express from "express";
import { checkAuth, getAllCustomers, login, logOut, refreshToken, signUp, } from "../controllers/userControl.js";
import { authenticateUser, ensureAdminOnlyAccess, } from "../middlewares/auth.js";
import { uploadImageViaMulter } from "../middlewares/multerUploadMiddleware.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
const userRoute = express.Router();
// Base URL: /api/v1/user
/**
 * @openapi
 * /api/v1/user/signUp:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with an uploaded photo. Requires a Firebase ID token in the Authorization header for authentication. The photo is uploaded to Cloudinary, and custom claims are set for the user's role.
 *     tags:
 *      - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: Firebase UID for the new user
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 description: User's gender
 *               DOB:
 *                 type: string
 *                 format: date
 *                 description: User's date of birth (YYYY-MM-DD)
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: User's role (admin restricted if one exists)
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: User's profile photo (max 8MB, image format)
 *             required:
 *               - uid
 *               - name
 *               - email
 *               - gender
 *               - DOB
 *               - role
 *               - photo
 *     responses:
 *       201:
 *         description: User created successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=None; Max-Age=3600000
 *             description: Sets a token cookie with the Firebase ID token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Welcome John Doe"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input, missing token, or no file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     - "No token provided in Authorization Header"
 *                     - "No file uploaded"
 *                     - "Please provide all required fields"
 *       401:
 *         description: Unauthorized - Invalid Firebase token or admin already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     - "Unauthorized"
 *                     - "can't signup, admin already exists"
 *       409:
 *         description: Email or UID already exists (if Mongoose unique constraint triggers)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already in use"
 */
userRoute.post("/signUp", uploadImageViaMulter, uploadToCloudinary, signUp);
/**
 * @openapi
 * /api/v1/user/login:
 *   post:
 *     summary: User login
 *     description: Verifies a Firebase ID token from the Authorization header, logs the user in, and sets a token cookie. Optionally extends cookie duration with rememberMe.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rememberMe:
 *                 type: boolean
 *                 description: If true, extends token cookie duration to 7 days; otherwise, session-only
 *                 default: false
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=None; Max-Age=604800000
 *             description: Sets a token cookie (7 days if rememberMe is true, session-only otherwise)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged in Successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No auth token provided, Login Failed!"
 *       404:
 *         description: User not found in database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found. Please signUp first."
 *       401:
 *         description: Unauthorized - Invalid Firebase token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 */
userRoute.post("/login", login);
/**
 * @openapi
 * /api/v1/user/logOut:
 *   post:
 *     summary: User logout
 *     description: Logs out the user by clearing the token cookie. No authentication is required since it only clears the client-side cookie.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=; HttpOnly; Secure; SameSite=None; Max-Age=0
 *             description: Clears the token cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged Out Successfully!"
 */
userRoute.post("/logOut", logOut);
/**
 * @openapi
 * /api/v1/user/refresh-token:
 *   post:
 *     summary: Refresh user token
 *     description: Verifies the Firebase ID token from the Authorization header and refreshes the token cookie. Optionally extends cookie duration with rememberMe.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rememberMe:
 *                 type: boolean
 *                 description: If true, extends token cookie duration to 7 days; otherwise, session-only
 *                 default: false
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=None; Max-Age=604800000
 *             description: Refreshes the token cookie (7 days if rememberMe is true, session-only otherwise)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Token refreshed successfully"
 *       400:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No auth token provided"
 *       404:
 *         description: User not found in database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No user found"
 *       401:
 *         description: Unauthorized - Invalid Firebase token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 */
userRoute.post("/refresh-token", refreshToken);
/**
 * @openapi
 * /api/v1/user/checkAuth:
 *   get:
 *     summary: Check authentication status
 *     description: Verifies the Firebase ID token from the token cookie to check if the user is authenticated and returns their role.
 *     tags: [Users]
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User Verified"
 *                 isAuthenticated:
 *                   type: boolean
 *                   example: true
 *                 role:
 *                   type: string
 *                   enum: [user, admin]
 *                   description: User's role from Firebase custom claims
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     - "No token provided, unauthorized!"
 *                     - "Unauthorized"
 */
userRoute.get("/checkAuth", checkAuth);
/**
 * @openapi
 * /api/v1/user/get-all:
 *   get:
 *     summary: Get all customers
 *     description: Retrieves a list of all customers from the database. Requires a valid Firebase ID token in the token cookie(with admin role encoded)
 *     tags: [Users]
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 allCustomers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - No token provided, invalid token, or non-admin role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     - "Unauthorized, No token provided"
 *                     - "Unauthorized"
 *                     - "Admin only Access\n Access Denied"
 *       404:
 *         description: No customers found in the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No customers Found"
 */
userRoute.get("/get-all", authenticateUser, ensureAdminOnlyAccess, getAllCustomers);
export default userRoute;
