class FeatureManager {
  private static _instance: FeatureManager;
  features: { [key: string]: boolean } = {};

  private constructor() {
    const urlParams = Object.fromEntries(new URLSearchParams(location.search));
    const appParams = {
      ...process.env,
      ...urlParams,
    };

    for (const [key, value] of Object.entries(appParams)) {
      if (key.indexOf('VUE_APP_FEATURE') === 0) {
        this.features[key.substring(16)] = value === 'true' || parseInt(value) === 1 ? true : false;
      }
    }
  }

  public static getInstance(): FeatureManager {
    return this._instance || (this._instance = new this());
  }

  public featureRunning(feature: string): boolean {
    return this.features[feature];
  }
}

const instance = FeatureManager.getInstance();
export const featureRunning = (name: string) => instance.featureRunning(name);
