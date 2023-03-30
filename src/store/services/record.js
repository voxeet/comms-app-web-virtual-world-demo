import VoxeetSDK from "@voxeet/voxeet-web-sdk";

export const startRecording = () => {
  return VoxeetSDK.recording
    .start()
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};

export const stopRecording = () => {
  return VoxeetSDK.recording
    .stop()
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};
