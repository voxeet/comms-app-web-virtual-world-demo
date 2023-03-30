import VoxeetSDK from "@voxeet/voxeet-web-sdk";

export const initializeSDK = ({ token, callback }) => {
  VoxeetSDK.packageUrlPrefix = `${window.location.origin}${
    import.meta.env.BASE_URL
  }assets/wasm`;
  VoxeetSDK.initializeToken(token, callback);
};
