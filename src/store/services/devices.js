import VoxeetSDK from "@voxeet/voxeet-web-sdk";
import { schema, normalize } from "normalizr";
import pick from "lodash.pick";

export const listAudioInputDevices = async () => {
  try {
    const devices = await VoxeetSDK.mediaDevice.enumerateAudioInputDevices();
    const device = new schema.Entity(
      "devices",
      {},
      {
        idAttribute: "deviceId",
        processStrategy: (entity) =>
          pick(entity, ["deviceId", "label", "kind", "groupId"]),
      }
    );
    const normalizedData = normalize(devices, [device]);
    return {
      ids: normalizedData.result,
      entities: normalizedData.entities,
    };
  } catch (error) {
    return { error };
  }
};

export const listAudioOutputDevices = async () => {
  try {
    const devices = await VoxeetSDK.mediaDevice.enumerateAudioOutputDevices();
    const device = new schema.Entity(
      "devices",
      {},
      {
        idAttribute: "deviceId",
        processStrategy: (entity) =>
          pick(entity, ["deviceId", "label", "kind", "groupId"]),
      }
    );
    const normalizedData = normalize(devices, [device]);
    return {
      ids: normalizedData.result,
      entities: normalizedData.entities,
    };
  } catch (error) {
    return { error };
  }
};

export const listVideoInputDevices = async () => {
  try {
    const devices = await VoxeetSDK.mediaDevice.enumerateVideoInputDevices();
    const device = new schema.Entity(
      "devices",
      {},
      {
        idAttribute: "deviceId",
        processStrategy: (entity) =>
          pick(entity, ["deviceId", "label", "kind", "groupId"]),
      }
    );
    const normalizedData = normalize(devices, [device]);
    return {
      ids: normalizedData.result,
      entities: normalizedData.entities,
    };
  } catch (error) {
    return { error };
  }
};

export const listAudioDevices = async () => {
  try {
    const audioDevices = await VoxeetSDK.mediaDevice.enumerateAudioDevices();
    const device = new schema.Entity(
      "devices",
      {},
      {
        idAttribute: "deviceId",
        processStrategy: (entity) => pick(entity, ["label", "kind", "groupId"]),
      }
    );
    const normalizedData = normalize(audioDevices, [device]);

    return {
      ids: normalizedData.result,
      entities: normalizedData.entities,
    };
  } catch (error) {
    return { error };
  }
};

export const listVideoDevices = async () => {
  try {
    const videoDevices = await VoxeetSDK.mediaDevice.enumerateVideoDevices();
    const device = new schema.Entity(
      "devices",
      {},
      {
        idAttribute: "deviceId",
        processStrategy: (entity) =>
          pick(entity, ["deviceId", "label", "kind", "groupId"]),
      }
    );
    const normalizedData = normalize(videoDevices, [device]);

    return {
      ids: normalizedData.result,
      entities: normalizedData.entities,
    };
  } catch (error) {
    return { error };
  }
};

export const selectVideoInput = async (id) => {
  return VoxeetSDK.mediaDevice
    .selectVideoInput(id)
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};

export const selectAudioInput = (id) => {
  return VoxeetSDK.mediaDevice
    .selectAudioInput(id)
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};

export const selectAudioOutput = (id) => {
  return VoxeetSDK.mediaDevice
    .selectAudioOutput(id)
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};

export const getSelectedAudioInputDevice = () => {
  try {
    const selectedDevice = VoxeetSDK.mediaDevice.selectedAudioInputDevice;

    const device = new schema.Entity(
      "devices",
      {},
      {
        idAttribute: "deviceId",
        processStrategy: (entity) =>
          pick(entity, ["deviceId", "label", "kind", "groupId"]),
      }
    );
    const normalizedData = normalize(selectedDevice, device);

    return {
      id: normalizedData.result,
      entities: normalizedData.entities,
    };
  } catch (error) {
    return { error };
  }
};

export const getSelectedAudioOutputDevice = () => {
  try {
    const selectedDevice = VoxeetSDK.mediaDevice.selectedAudioOutputDevice;

    const device = new schema.Entity(
      "devices",
      {},
      {
        idAttribute: "deviceId",
        processStrategy: (entity) =>
          pick(entity, ["deviceId", "label", "kind", "groupId"]),
      }
    );
    const normalizedData = normalize(selectedDevice, device);

    return {
      id: normalizedData.result,
      entities: normalizedData.entities,
    };
  } catch (error) {
    return { error };
  }
};

export const getSelectedVideoInputDevice = () => {
  try {
    const selectedDevice = VoxeetSDK.mediaDevice.selectedVideoInputDevice;

    const device = new schema.Entity(
      "devices",
      {},
      {
        idAttribute: "deviceId",
        processStrategy: (entity) =>
          pick(entity, ["deviceId", "label", "kind", "groupId"]),
      }
    );
    const normalizedData = normalize(selectedDevice, device);

    return {
      id: normalizedData.result,
      entities: normalizedData.entities,
    };
  } catch (error) {
    return { error };
  }
};
