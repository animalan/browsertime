import { Simpleperf } from '../../../android/simpleperf.js';
import { isAndroidConfigured } from '../../../android/index.js';
import { getLogger } from '@sitespeed.io/log';

/**
 * Manages Android's Simpleperf Profiler for profiling Chrome / Firefox mobile performance.
 *
 * @class
 * @hideconstructor
 */

const log = getLogger('browsertime.command.simpleperf');

const defaultRecordOptions =
  '--call-graph fp --duration 240 -f 1000 --trace-offcpu -e cpu-clock';

export class SimpleperfProfiler {
  constructor(browser, index, storageManager, options) {
    this.Simpleperf = new Simpleperf(browser, index, storageManager, options);
    this.options = options;
  }

  /**
   * Starts the Simpleperf Profiler.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when the profiler is started.
   * @throws {Error} Throws an error if not running on Android or if the configuration is not set for custom profiling.
   */
  async start(
    profilerOptions = [],
    recordOptions = defaultRecordOptions,
    dirName = 'simpleperf'
  ) {
    if (!isAndroidConfigured(this.options)) {
      throw new Error('Simpleperf Profiling is only available on Android.');
    }

    if (
      this.options.browser === 'firefox' ||
      this.options.browser === 'chrome'
    ) {
      if (this.options.android?.simpleperfRecordingType === 'custom') {
        return this.Simpleperf.start(profilerOptions, recordOptions, dirName);
      } else {
        log.info(
          'You need to set simpleperfRecordingType to custom to use simpleperf profiling commands in scripts'
        );
      }
    } else {
      throw new Error(
        'Simpleperf only works on Android Browsers (Chrome and Firefox)'
      );
    }
  }

  /**
   * Stops the Simpleperf Profiler and processes the collected data.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when the profiler is stopped and the data is processed.
   * @throws {Error} Throws an error if not running on Android or if custom profiling was not started.
   */
  async stop() {
    if (!isAndroidConfigured(this.options)) {
      throw new Error('Simpleperf Profiling is only available on Android.');
    }

    if (
      this.options.browser === 'firefox' ||
      this.options.browser === 'chrome'
    ) {
      if (this.options.android?.simpleperfRecordingType === 'custom') {
        return this.Simpleperf.stop();
      }
    } else {
      throw new Error(
        'Simpleperf only works on Android Browsers (Chrome and Firefox)'
      );
    }
  }
}
