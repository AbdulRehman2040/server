const { getExecOutput } = require( './api-handlers-helpers' );
var os = require('os');




exports.testSpeedHandler = async () => {
  try {
    // Use fast-cli's Node.js API directly
    const result = await fast({
      upload: true,
      json: true,
      timeout: 10000 // 10 seconds timeout
    });

    // Handle no internet connection case
    if (!result || result.error) {
      return {
        status: 400,
        data: {
          error: result?.error || 'No internet connection',
          details: 'Failed to perform speed test'
        }
      };
    }

    // Successful response
    return {
      status: 200,
      data: {
        ...result,
        server: os.hostname(),
        os: process.platform,
        nodeVersion: process.version
      }
    };

  } catch (error) {
    console.error('Speed test error:', error);
    
    // Handle specific error cases
    let statusCode = 500;
    let errorMessage = 'Speed test failed';

    if (error.message.includes('timeout')) {
      statusCode = 408;
      errorMessage = 'Speed test timed out';
    } else if (error.message.includes('ENOTFOUND')) {
      statusCode = 503;
      errorMessage = 'Network unreachable';
    }

    return {
      status: statusCode,
      data: {
        error: errorMessage,
        details: error.message,
        os: process.platform,
        server: os.hostname()
      }
    };
  }
};