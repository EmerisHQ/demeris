// stopped working on this when I realized it probably isn't really necessary atm.
// But maybe in the future when we need more verbose logging

/**
 * @desc Tracks & appends error logs to report at once or garbage-collect itself.
 */

interface LogCollectorOptions {
  lifetime?: number;
}
const defaultOptions = {
  lifetime: 1000,
};

export type Log = Error; // TODO : cover events and custom messages as well when / if required

export class LogCollector {
  private _id: string;
  private options: LogCollectorOptions = defaultOptions;
  private removeSelfCb: () => undefined;
  private logs: Log[];
  private timeout; //  NodeJS.Timeout

  constructor(id: string, removeCb: () => undefined, options?: LogCollectorOptions) {
    this._id = id;
    Object.assign(this.options, options);
    this.removeSelfCb = removeCb;

    this.timeout = setTimeout(() => this.removeSelfCb(), options.lifetime);
  }

  public append() {
    // TODO : takes data and pushes to logs. Optional refresh lifetime timer
  }

  public returnData() {
    // TODO : parses, refines and returns the collected data in suitable format / object
    this.destroy();
  }

  public destroy() {
    clearTimeout(this.timeout);
    this.removeSelfCb();
  }
}
