import { describe, it, expect, vi, afterEach } from "vitest";
import {
  listAudioDevices,
  listVideoDevices,
  selectAudioInput,
  selectAudioOutput,
  selectVideoInput,
  listVideoInputDevices,
  listAudioInputDevices,
  listAudioOutputDevices,
  getSelectedAudioInputDevice,
  getSelectedAudioOutputDevice,
  getSelectedVideoInputDevice,
} from "./devices";

const mockEnumerateAudioDevices = vi.fn();
const mockEnumerateVideoDevices = vi.fn();
const mockListAudioInputDevices = vi.fn();
const mockListAudioOutputDevices = vi.fn();
const mockListVideoInputDevices = vi.fn();

const mockSelectAudioInput = vi.fn();
const mockSelectVideoInput = vi.fn();
const mockSelectAudioOutput = vi.fn();

const selectedAudioInputDevice = {
  kind: "audioinput",
  label: "label",
  groupId: "123",
  deviceId: "345",
};

const selectedAudioOutputDevice = {
  kind: "audiooutput",
  label: "label",
  groupId: "123",
  deviceId: "345",
};

const selectedVideoInputDevice = {
  kind: "videoinput",
  label: "label",
  groupId: "123",
  deviceId: "345",
};

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {
    get mediaDevice() {
      return {
        enumerateAudioDevices: mockEnumerateAudioDevices,
        enumerateVideoDevices: mockEnumerateVideoDevices,
        enumerateAudioInputDevices: mockListAudioInputDevices,
        enumerateAudioOutputDevices: mockListAudioOutputDevices,
        enumerateVideoInputDevices: mockListVideoInputDevices,
        selectAudioInput: mockSelectAudioInput,
        selectAudioOutput: mockSelectAudioOutput,
        selectVideoInput: mockSelectVideoInput,
        get selectedAudioInputDevice() {
          return selectedAudioInputDevice;
        },
        get selectedAudioOutputDevice() {
          return selectedAudioOutputDevice;
        },
        get selectedVideoInputDevice() {
          return selectedVideoInputDevice;
        },
      };
    },
  },
}));

describe("devices test  suite", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("it should return formatted selected audio input device", () => {
    // arrange
    const expectedEntities = {
      devices: {
        345: {
          deviceId: "345",
          groupId: "123",
          kind: "audioinput",
          label: "label",
        },
      },
    };

    // act
    const { id, entities, error } = getSelectedAudioInputDevice();

    // assert
    expect(error).toBe(undefined);
    expect(id).toBe("345");
    expect(entities).toStrictEqual(expectedEntities);
  });

  it("it should return formatted selected audio output device", () => {
    // arrange
    const expectedEntities = {
      devices: {
        345: {
          deviceId: "345",
          groupId: "123",
          kind: "audiooutput",
          label: "label",
        },
      },
    };

    // act
    const { id, entities, error } = getSelectedAudioOutputDevice();

    // assert
    expect(error).toBe(undefined);
    expect(id).toBe("345");
    expect(entities).toStrictEqual(expectedEntities);
  });

  it("it should return formatted selected video input device", () => {
    // arrange
    const expectedEntities = {
      devices: {
        345: {
          deviceId: "345",
          groupId: "123",
          kind: "videoinput",
          label: "label",
        },
      },
    };

    // act
    const { id, entities, error } = getSelectedVideoInputDevice();

    // assert
    expect(error).toBe(undefined);
    expect(id).toBe("345");
    expect(entities).toStrictEqual(expectedEntities);
  });

  it("should return audio devices list", async () => {
    // arrange
    const device = {
      kind: "audioinput",
      label: "label",
      groupId: "groupId",
      deviceId: "deviceId",
    };
    mockListAudioInputDevices.mockResolvedValue([device]);

    // act
    const { ids, entities, error } = await listAudioInputDevices();

    // assert
    expect(mockListAudioInputDevices).toHaveBeenCalled();
    expect(ids).toEqual(expect.arrayContaining([device.deviceId]));
    expect(entities.devices).toEqual(
      expect.objectContaining({
        [device.deviceId]: expect.objectContaining({
          deviceId: device.deviceId,
          label: device.label,
          groupId: device.groupId,
          kind: device.kind,
        }),
      })
    );
    expect(error).toBe(undefined);
  });

  it("should return an error", async () => {
    // arrange
    const expected = { message: "oops" };
    mockListAudioInputDevices.mockRejectedValue(expected);

    // act
    const { error } = await listAudioInputDevices();

    // assert
    expect(error).toBe(expected);
  });

  it("should return audio devices list", async () => {
    // arrange
    const device = {
      kind: "audiooutput",
      label: "label",
      groupId: "groupId",
      deviceId: "deviceId",
    };
    mockListAudioOutputDevices.mockResolvedValue([device]);

    // act
    const { ids, entities, error } = await listAudioOutputDevices();

    // assert
    expect(mockListAudioOutputDevices).toHaveBeenCalled();
    expect(ids).toEqual(expect.arrayContaining([device.deviceId]));
    expect(entities.devices).toEqual(
      expect.objectContaining({
        [device.deviceId]: expect.objectContaining({
          deviceId: device.deviceId,
          label: device.label,
          groupId: device.groupId,
          kind: device.kind,
        }),
      })
    );
    expect(error).toBe(undefined);
  });

  it("should return an error", async () => {
    // arrange
    const expected = { message: "oops" };
    mockListAudioOutputDevices.mockRejectedValue(expected);

    // act
    const { error } = await listAudioOutputDevices();

    // assert
    expect(error).toBe(expected);
  });

  it("should return audio devices list", async () => {
    // arrange
    const device = {
      kind: "videoinput",
      label: "label",
      groupId: "groupId",
      deviceId: "deviceId",
    };
    mockListVideoInputDevices.mockResolvedValue([device]);

    // act
    const { ids, entities, error } = await listVideoInputDevices();

    // assert
    expect(mockListVideoInputDevices).toHaveBeenCalled();
    expect(ids).toEqual(expect.arrayContaining([device.deviceId]));
    expect(entities.devices).toEqual(
      expect.objectContaining({
        [device.deviceId]: expect.objectContaining({
          deviceId: device.deviceId,
          label: device.label,
          groupId: device.groupId,
          kind: device.kind,
        }),
      })
    );
    expect(error).toBe(undefined);
  });

  it("should return an error", async () => {
    // arrange
    const expected = { message: "oops" };
    mockListVideoInputDevices.mockRejectedValue(expected);

    // act
    const { error } = await listVideoInputDevices();

    // assert
    expect(error).toBe(expected);
  });

  it("should succeed and return a list of devices", async () => {
    // arrange
    const firstMediaDevice = {
      kind: "audioinput",
      label: "label",
      groupId: "groupId",
      deviceId: "deviceId",
    };
    mockEnumerateAudioDevices.mockResolvedValue([firstMediaDevice]);

    // act
    const result = await listAudioDevices();

    // assert
    expect(mockEnumerateAudioDevices).toHaveBeenCalled();
    expect(result).toMatchSnapshot();
  });

  it("should fail and return an error", async () => {
    // arrange
    mockEnumerateAudioDevices.mockRejectedValue(new Error("Async error"));

    // act
    const result = await listAudioDevices();

    // assert
    expect(mockEnumerateAudioDevices).toHaveBeenCalled();
    expect(mockEnumerateAudioDevices).toHaveBeenCalled();
    expect(result).toMatchSnapshot();
  });

  it(" should succeed and return a list of devices", async () => {
    // arrange
    const firstMediaDevice = {
      kind: "videoinput",
      label: "label",
      groupId: "groupId",
      deviceId: "deviceId",
    };
    mockEnumerateVideoDevices.mockResolvedValue([firstMediaDevice]);

    // act
    const result = await listVideoDevices();

    // assert
    expect(mockEnumerateVideoDevices).toHaveBeenCalled();
    expect(result).toMatchSnapshot();
  });

  it("should fail and return an error", async () => {
    // arrange
    mockEnumerateVideoDevices.mockRejectedValue(new Error("Async error"));

    // act
    const result = await listVideoDevices();

    // assert
    expect(mockEnumerateVideoDevices).toHaveBeenCalled();
    expect(result).toMatchSnapshot();
  });

  it("should succeed", async () => {
    // arrange
    const deviceId = "123";
    mockSelectAudioInput.mockResolvedValue({ response: {} });

    // act
    const { response, error } = await selectAudioInput(deviceId);

    // assert
    expect(response).toMatchSnapshot();
    expect(error).toBe(undefined);
    expect(mockSelectAudioInput).toHaveBeenCalled();
    expect(mockSelectAudioInput).toHaveBeenCalledWith(deviceId);
  });

  it("sshould fail and return an error", async () => {
    // arrange
    const deviceId = "123";
    mockSelectAudioInput.mockRejectedValue(new Error("Async error"));

    // act
    const { error } = await selectAudioInput(deviceId);

    // assert
    expect(mockSelectAudioInput).toHaveBeenCalled();
    expect(mockSelectAudioInput).toHaveBeenCalledWith(deviceId);
    expect(error).not.toBe(undefined);
    expect(error).toMatchSnapshot();
  });

  it("should succeed", async () => {
    // arrange
    const deviceId = "123";
    mockSelectAudioOutput.mockResolvedValue({ response: {} });

    // act
    const { response, error } = await selectAudioOutput(deviceId);

    // assert
    expect(error).toBe(undefined);
    expect(response).toMatchSnapshot();
    expect(mockSelectAudioOutput).toHaveBeenCalled();
    expect(mockSelectAudioOutput).toHaveBeenCalledWith(deviceId);
  });

  it("should fail and return an error", async () => {
    // arrange
    const deviceId = "123";
    mockSelectAudioOutput.mockRejectedValue(new Error("Async error"));

    // act
    const { error } = await selectAudioOutput(deviceId);

    // assert
    expect(mockSelectAudioOutput).toHaveBeenCalled();
    expect(mockSelectAudioOutput).toHaveBeenCalledWith(deviceId);
    expect(error).not.toBe(undefined);
    expect(error).toMatchSnapshot();
  });

  it("should succeed", async () => {
    // arrange
    const deviceId = "123";
    mockSelectVideoInput.mockResolvedValue({ response: {} });

    // act
    const { response, error } = await selectVideoInput(deviceId);

    // assert
    expect(error).toBe(undefined);
    expect(response).toMatchSnapshot();
    expect(mockSelectVideoInput).toHaveBeenCalled();
    expect(mockSelectVideoInput).toHaveBeenCalledWith(deviceId);
  });

  it("should fail and return an error", async () => {
    // arrange
    const deviceId = "123";
    mockSelectVideoInput.mockRejectedValue(new Error("Async error"));

    // act
    const { error } = await selectVideoInput(deviceId);

    // assert
    expect(mockSelectVideoInput).toHaveBeenCalled();
    expect(mockSelectVideoInput).toHaveBeenCalledWith(deviceId);
    expect(error).not.toBe(undefined);
    expect(error).toMatchSnapshot();
  });
});
