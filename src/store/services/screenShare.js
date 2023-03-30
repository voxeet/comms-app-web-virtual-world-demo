import VoxeetSDK from "@voxeet/voxeet-web-sdk";

export const startScreenShare = (option = { audio: true }) => {
  return VoxeetSDK.conference
    .startScreenShare(option)
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};

export const stopScreenShare = () => {
  return VoxeetSDK.conference
    .stopScreenShare({ audio: true })
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};
