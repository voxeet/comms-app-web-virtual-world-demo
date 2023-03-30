import VoxeetSDK from "@voxeet/voxeet-web-sdk";

export const openSession = (payload) => {
  return VoxeetSDK.session
    .open(payload)
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};

export const closeSession = () => {
  return VoxeetSDK.session
    .close()
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};
