import VoxeetSDK from "@voxeet/voxeet-web-sdk";

export const startRemoteAudio = (participant) => {
  return VoxeetSDK.audio.remote
    .start(participant)
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};

export const stopRemoteAudio = (participant) => {
  return VoxeetSDK.audio.remote
    .stop(participant)
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};

export const startLocalAudio = () => {
  return VoxeetSDK.audio.local
    .start()
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};

export const stopLocalAudio = () => {
  return VoxeetSDK.audio.local
    .stop()
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};
