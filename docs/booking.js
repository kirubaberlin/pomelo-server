/**
 * @swagger
 * /zoom/auth:
 *   get:
 *     summary: Get Zoom OAuth Authorization
 *     description: Redirects to Zoom OAuth authorization flow.
 *     responses:
 *       302:
 *         description: Redirect to Zoom OAuth authorization page.
 */

/**
 * @swagger
 * /redirect:
 *   get:
 *     summary: Handle Zoom OAuth Redirect
 *     description: Handles the Zoom OAuth redirect after user authorization.
 *     responses:
 *       200:
 *         description: Zoom OAuth code handled successfully and access token obtained.
 *       400:
 *         description: Missing authorization code or error during token acquisition.

 * @swagger
 * /booking:
 *   post:
 *     summary: Create a new booking
 *     description: Creates a new booking, generates a Zoom meeting, and stores it in the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               consultant:
 *                 type: string
 *                 description: The consultant's ID.
 *               jobseeker:
 *                 type: string
 *                 description: The jobseeker's ID.
 *               sessionDate:
 *                 type: string
 *                 description: The date and time of the session.
 *               packageType:
 *                 type: number
 *                 description: The type of package.
 *               paymentStatus:
 *                 type: string
 *                 description: The payment status.
 *           required: [consultant, jobseeker, sessionDate, packageType, paymentStatus]
 *     responses:
 *       201:
 *         description: Booking created successfully.
 *       400:
 *         description: Invalid or missing data in the request body.

 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     description: Retrieves a list of all bookings.
 *     responses:
 *       200:
 *         description: A list of bookings.

 * @swagger
 * /booking/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     description: Retrieves a booking by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the booking.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The booking found by ID.
 *       404:
 *         description: Booking not found.

 *   patch:
 *     summary: Update a booking by ID
 *     description: Updates a booking by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the booking.
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               consultant:
 *                 type: string
 *                 description: The consultant's ID.
 *               jobseeker:
 *                 type: string
 *                 description: The jobseeker's ID.
 *               sessionDate:
 *                 type: string
 *                 description: The date and time of the session.
 *               packageType:
 *                 type: number
 *                 description: The type of package.
 *               paymentStatus:
 *                 type: string
 *                 description: The payment status.
 *           required: []
 *     responses:
 *       200:
 *         description: The updated booking.
 *       404:
 *         description: Booking not found.

 *   delete:
 *     summary: Delete a booking by ID
 *     description: Deletes a booking by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the booking.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Booking deleted successfully.
 *       404:
 *         description: Booking not found.
 */

/**
 * @swagger
 * /zoom/callback:
 *   get:
 *     summary: Handle Zoom OAuth Callback
 *     description: Handles the Zoom OAuth callback after user authorization.
 *     responses:
 *       200:
 *         description: Zoom OAuth callback handled successfully.
 *       400:
 *         description: Missing authorization code or error during token acquisition.
 */
