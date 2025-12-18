export default function errorHandler(err, req, res, next) {
  const status = err && err.status ? err.status : 500;

  // Log full error on the server for debugging (stack only in server logs)
  console.error(`[${new Date().toISOString()}] Error on ${req.method} ${req.originalUrl}:`, err && err.stack ? err.stack : err);

  // For client-facing messages, be user-friendly and avoid leaking internal error details.
  let clientMessage;
  if (status >= 500) {
    clientMessage = 'Something went wrong on our end. Please try again later.';
  } else {
    clientMessage = err && err.message ? err.message : 'Request error';
  }

  res.status(status).json({
    status: 'error',
    message: clientMessage,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
}
