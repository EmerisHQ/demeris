/**
 * @desc Tracks and collects error related data and reports to Sentry
 */
import { captureException } from '@sentry/vue';

class AppLogger {
  public reportSingleError(error: Error, msg?: string) {
    if (msg) {
      return captureException(Object.assign(error, { data: { msg } }));
    }
    captureException(error);
  }

  // TODO : psuedocode-ish writeup for more verbose logging functionality

  // private logCollectors = new Map<string, LogCollector>();

  /**
   * @desc initialize a LogCollector. Assign a uuid and return said uuid for future reference. Track LogCollector via map
   */
  public createLogCollector() {
    // TODO
  }

  /**
   * @desc takes a uuid & Log Object. Append to said logCollector
   */
  public appendDataTologCollector() {
    // TODO
  }

  /**
   * @desc takes a uuid and reports the logs to sentry
   */
  public reportLogCollector() {
    // TODO
  }
}

const appLogger = new AppLogger();

export { appLogger };
