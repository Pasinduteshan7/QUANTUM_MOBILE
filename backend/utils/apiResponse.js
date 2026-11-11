/**
 * Standardized API Response Helper (Spring Boot ApiResponse<T> equivalent)
 * 
 * Provides consistent response envelopes across all endpoints:
 * {
 *   success: true/false,
 *   message: "Human-readable description",
 *   data: { ... },
 *   timestamp: ISO string
 * }
 */
export const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const sendError = (res, statusCode = 500, message = 'Server Error', errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};
