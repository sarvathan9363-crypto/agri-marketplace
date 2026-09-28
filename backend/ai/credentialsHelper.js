const fs = require('fs');
const path = require('path');

/**
 * Resolves and verifies Google Cloud service account credentials path.
 * Supports relative and absolute paths safely across Windows and Linux.
 * 
 * @returns {{ hasCredentials: boolean, resolvedPath: string|null, error: string|null }}
 */
function resolveGoogleCredentials() {
  const envPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!envPath || envPath.trim() === '') {
    return {
      hasCredentials: false,
      resolvedPath: null,
      error: 'GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.'
    };
  }

  const trimmed = envPath.trim();

  // Try direct path or resolve relative to backend root
  const candidates = [
    path.resolve(trimmed),
    path.resolve(__dirname, '..', trimmed),
    path.resolve(__dirname, '../..', trimmed)
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return {
          hasCredentials: true,
          resolvedPath: candidate,
          error: null
        };
      }
    } catch {
      // Ignore permission or file system check errors for candidate
    }
  }

  return {
    hasCredentials: false,
    resolvedPath: null,
    error: `Credentials file not found at: ${trimmed}`
  };
}

module.exports = {
  resolveGoogleCredentials
};
