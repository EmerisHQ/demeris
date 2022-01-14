class FeatureManager {
  private static _instance: FeatureManager;
  features: { [key: string]: boolean } = {};

  private constructor() {
    for (const [key, value] of Object.entries(process.env).filter((i) => i[0].indexOf('VUE_APP_FEATURE_') > -1)) {
      this.features[key] = value === 'true' ? true : false;
    }

    location.search
      .substr(1)
      .split('&')
      .filter((i) => i.indexOf('VUE_APP_FEATURE_') > -1)
      .forEach((item) => {
        const [key, value] = item.split('=');
        this.features[key] = value === 'true' || parseInt(value) === 1 ? true : false;
      });
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
