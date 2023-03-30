import VoxeetSDK from "@voxeet/voxeet-web-sdk";

export const setEnvironment = (payload) => {
  VoxeetSDK.conference.setSpatialEnvironment(
    payload.scale,
    payload.forward,
    payload.up,
    payload.right
  );
};

export const setPosition = (participantId, position = { x: 0, y: 0, z: 0 }) => {
  const participant = VoxeetSDK.conference.participants.get(participantId);
  VoxeetSDK.conference.setSpatialPosition(participant, position);
};

export const setDirection = (
  participantId,
  direction = { x: 0, y: 0, z: 0 }
) => {
  const participant = VoxeetSDK.conference.participants.get(participantId);
  VoxeetSDK.conference.setSpatialDirection(participant, direction);
};
