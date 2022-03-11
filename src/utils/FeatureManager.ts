class FeatureManager {
  private static _instance: FeatureManager;
  features: { [key: string]: boolean } = {};

  private constructor() {
    this.load();
  }

  public static getInstance(): FeatureManager {
    return this._instance || (this._instance = new this());
  }

  public featureRunning(feature: string): boolean {
    return this.features[feature];
  }

  public load() {
    const urlParams = Object.fromEntries(new URLSearchParams(location.search));
    const appParams = {
      ...import.meta.env,
      ...urlParams,
    };
    for (const [key, value] of Object.entries(appParams)) {
      if (key.startsWith('VITE_FEATURE_')) {
        this.features[key.replace('VITE_FEATURE_', '')] = value === 'true' || parseInt(value) === 1 ? true : false;
      }
    }
  }
}

const instance = FeatureManager.getInstance();
export const featureRunning = (name: string) => instance.featureRunning(name);
// testing helper
export const loadFeaturesRunning = () => instance.load();
