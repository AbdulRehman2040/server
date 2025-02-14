const { getExecOutput } = require('./api-handlers-helpers');
var os = require('os');

exports.testSpeedHandler = async () => {
  try {
    // Execute the speed test using the fast-cli command line tool
    const command = `node_modules/.bin/fast --upload --json --timeout 10000`
    const execResult = await getExecOutput(command);

    if (execResult.status !== 200) {
        let errorDetails = execResult.data;
        return {
            status: statusCode,
            data: {
              error: errorMessage,
              details: {
                message: error.message,
                stack: error.stack, // Add error stack
                path: process.env.PATH, // Check PATH environment
                cwd: process.cwd() // Check working directory
              },
              os: process.platform,
              server: os.hostname()
            }
      };
    }

    // Parse the JSON output
    let result;
    try {
      result = JSON.parse(execResult.data);
    } catch (parseError) {
      console.error('Failed to parse speed test result:', parseError);
      return {
        status: 500,
        data: {
          error: 'Invalid speed test output',
          details: parseError.message,
          os: process.platform,
          server: os.hostname()
        }
      };
    }

    // Handle errors from the speed test results
    if (result.error) {
      return {
        status: 400,
        data: {
          error: result.error,
          details: 'Speed test failed',
          os: process.platform,
          server: os.hostname()
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