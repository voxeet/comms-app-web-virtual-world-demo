import VoxeetSDK from "@voxeet/voxeet-web-sdk";

export const startVideo = (participant) => {
  return VoxeetSDK.conference
    .startVideo(participant, {
      audio: true,
      video: true,
    })
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};

export const stopVideo = (participant) => {
  return VoxeetSDK.conference
    .stopVideo(participant)
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};
