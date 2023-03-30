import {
  enumerateAudioDevices,
  enumerateVideoDevices,
  enumerateAudioInputDevices,
  enumerateAudioOutputDevices,
  enumerateVideoInputDevices,
  setAudioInput,
  setAudioOutput,
  setVideoInput,
  updateDevices,
  getAudioOutputDevice,
  getAudioInputDevice,
  getVideoInputDevice,
} from "./devices";
import {
  selectAudioInput,
  selectAudioOutput,
  selectVideoInput,
  listVideoDevices,
  listAudioDevices,
  listAudioInputDevices,
  listAudioOutputDevices,
  listVideoInputDevices,
  getSelectedAudioInputDevice,
  getSelectedAudioOutputDevice,
  getSelectedVideoInputDevice,
} from "../../services/devices";
import { all, call, put, select } from "redux-saga/effects";

import { addDevice, updateParticipant } from "../../effects/conference";
import { getLocalParticipantID } from "../../reducers/application/selectors";
import { getParticipant } from "./audio";
import { vi, expect, it, describe } from "vitest";
import { displayMessage } from "./message.js";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("devices test suite", () => {
  it("should update device id list and participant", () => {
    // arrange
    const devicesList = { 123: { label: "default" } };
    const devicesIds = ["123"];
    const deviceType = "videoinput";
    const participantID = "890";
    const participant = {};

    // act
    const generator = updateDevices(devicesList, devicesIds, deviceType);

    // assert
    expect(generator.next().value).toEqual(
      all(
        Object.entries(devicesList).map(([id, value]) =>
          put(
            addDevice({
              id,
              data: value,
              entityType: "devices",
            })
          )
        )
      )
    );
    expect(generator.next().value).toEqual(select(getLocalParticipantID));
    expect(generator.next(participantID).value).toEqual(
      select(getParticipant, participantID)
    );
    expect(generator.next(participant).value).toEqual(
      put(
        updateParticipant({
          id: participantID,
          entityType: "participants",
          data: { [deviceType]: devicesIds },
        })
      )
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should fail to get video input device and dispatch action to store", () => {
    // arrange
    const error = {};

    // act
    const generator = getVideoInputDevice();

    // assert
    expect(generator.next().value).toEqual(call(getSelectedVideoInputDevice));
    expect(generator.next({ error }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not retrieve current video input device",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should  get video input device", () => {
    // arrange
    const error = undefined;
    const id = "123";
    const entities = {};
    const participantID = "456";
    const participant = {};

    // act
    const generator = getVideoInputDevice();

    // assert
    expect(generator.next().value).toEqual(call(getSelectedVideoInputDevice));
    expect(generator.next({ error, id, entities }).value).toEqual(
      select(getLocalParticipantID)
    );
    expect(generator.next(participantID).value).toEqual(
      select(getParticipant, participantID)
    );
    expect(generator.next(participant).value).toEqual(
      put(
        updateParticipant({
          id: participantID,
          entityType: "participants",
          data: { selectedVideoInputDeviceId: id },
        })
      )
    );

    expect(generator.next().done).toBeTruthy();
  });

  it("should fail to get audio output device and dispatch action to store", () => {
    // arrange
    const error = {};

    // act
    const generator = getAudioOutputDevice();

    // assert
    expect(generator.next().value).toEqual(call(getSelectedAudioOutputDevice));
    expect(generator.next({ error }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not retrieve current audio output device",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should  get audio output device", () => {
    // arrange
    const error = undefined;
    const id = "123";
    const entities = {};
    const participantID = "456";
    const participant = {};

    // act
    const generator = getAudioOutputDevice();

    // assert
    expect(generator.next().value).toEqual(call(getSelectedAudioOutputDevice));
    expect(generator.next({ error, id, entities }).value).toEqual(
      select(getLocalParticipantID)
    );
    expect(generator.next(participantID).value).toEqual(
      select(getParticipant, participantID)
    );
    expect(generator.next(participant).value).toEqual(
      put(
        updateParticipant({
          id: participantID,
          entityType: "participants",
          data: { selectedAudioOutputDeviceId: id },
        })
      )
    );

    expect(generator.next().done).toBeTruthy();
  });

  it("should fail to get audio input device and dispatch action to store", () => {
    // arrange
    const error = {};

    // act
    const generator = getAudioInputDevice();

    // assert
    expect(generator.next().value).toEqual(call(getSelectedAudioInputDevice));
    expect(generator.next({ error }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not retrieve current audio input device",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should  get audio input device", () => {
    // arrange
    const error = undefined;
    const id = "123";
    const entities = {};
    const participantID = "456";
    const participant = {};

    // act
    const generator = getAudioInputDevice();

    // assert
    expect(generator.next().value).toEqual(call(getSelectedAudioInputDevice));
    expect(generator.next({ error, id, entities }).value).toEqual(
      select(getLocalParticipantID)
    );
    expect(generator.next(participantID).value).toEqual(
      select(getParticipant, participantID)
    );
    expect(generator.next(participant).value).toEqual(
      put(
        updateParticipant({
          id: participantID,
          entityType: "participants",
          data: { selectedAudioInputDeviceId: id },
        })
      )
    );

    expect(generator.next().done).toBeTruthy();
  });

  it("should select audio input device", () => {
    // arrange
    const payload = {};

    // act
    const generator = setAudioInput({ payload });

    // assert
    expect(generator.next().value).toEqual(call(selectAudioInput, payload));
    expect(generator.next({ result: {} }).done).toBeTruthy();
  });

  it("should fail to select audio input device and dispatch an action to store", () => {
    // arrange
    const payload = {};
    const error = {};

    // act
    const generator = setAudioInput({ payload });

    // assert
    expect(generator.next().value).toEqual(call(selectAudioInput, payload));
    expect(generator.next({ error }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not select audio input device",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should select audio output device", () => {
    // arrange
    const payload = {};

    // act
    const generator = setAudioOutput({ payload });

    // assert
    expect(generator.next().value).toEqual(call(selectAudioOutput, payload));
    expect(generator.next({ result: {} }).done).toBeTruthy();
  });

  it("should fail to select audio output device and dispatch an action to store", () => {
    // arrange
    const payload = {};
    const error = {};

    // act
    const generator = setAudioOutput({ payload });

    // assert
    expect(generator.next().value).toEqual(call(selectAudioOutput, payload));
    expect(generator.next({ error }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "sdk: failed to select audio output device",
      })
    );
    expect(generator.next({ result: {} }).done).toBeTruthy();
  });

  it("should select video input device", () => {
    // arrange
    const payload = {};

    // act
    const generator = setVideoInput({ payload });

    // assert
    expect(generator.next().value).toEqual(call(selectVideoInput, payload));
    expect(generator.next({ result: {} }).done).toBeTruthy();
  });

  it("should fail to select video input device and disaptch an action to store", () => {
    // arrange
    const payload = {};
    const error = {};

    // act
    const generator = setVideoInput({ payload });

    // assert
    expect(generator.next().value).toEqual(call(selectVideoInput, payload));
    expect(generator.next({ error }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not select video input device",
      })
    );
    expect(generator.next({ result: {} }).done).toBeTruthy();
  });

  it("should fail to enumerate audio input devices and dispatch an action to store", () => {
    // arrange
    const entities = {
      1: {},
    };
    const error = {};
    const ids = ["1"];
    const participantID = "123";
    const participant = { id: participantID, audioInputDevices: [] };

    // act
    const generator = enumerateAudioInputDevices();

    // assert
    expect(generator.next().value).toEqual(call(listAudioInputDevices));
    expect(generator.next({ error }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not list audio input devices",
      })
    );

    expect(generator.next().done).toBeTruthy();
  });

  it("should dispatch effects for every audio input devices and update participant", () => {
    // arrange
    const entities = {
      1: {},
    };
    const ids = ["1"];
    const participantID = "123";
    const participant = { id: participantID, audioInputDevices: [] };

    // act
    const generator = enumerateAudioInputDevices();

    // assert
    expect(generator.next().value).toEqual(call(listAudioInputDevices));
    expect(generator.next({ ids, entities, participant }).value).toEqual(
      call(updateDevices, entities, ids, "audioInputDevices")
    );
    expect(generator.next().value).toEqual(call(getAudioInputDevice));
    expect(generator.next().done).toBeTruthy();
  });

  it("should fail to lsit audio output devices and dispatch an acton to store", () => {
    // arrange
    const error = {};

    // act
    const generator = enumerateAudioOutputDevices();

    // assert
    expect(generator.next().value).toEqual(call(listAudioOutputDevices));
    expect(generator.next({ error }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not list audio output devices",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should dispatch effects for every audio output devices and update participant", () => {
    // arrange
    const entities = {
      1: {},
    };
    const ids = ["1"];
    const participantID = "123";
    const participant = { id: participantID, audioInputDevices: [] };

    // act
    const generator = enumerateAudioOutputDevices();

    // assert
    expect(generator.next().value).toEqual(call(listAudioOutputDevices));
    expect(generator.next({ ids, entities, participant }).value).toEqual(
      call(updateDevices, entities, ids, "audioOutputDevices")
    );
    expect(generator.next().value).toEqual(call(getAudioOutputDevice));
    expect(generator.next().done).toBeTruthy();
  });

  it("should fail to list video input devices and dispatch an action to store", () => {
    // arrange
    const error = {};

    // act
    const generator = enumerateVideoInputDevices();

    // assert
    expect(generator.next().value).toEqual(call(listVideoInputDevices));
    expect(generator.next({ error }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not list video input devices",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should dispatch effects for every video input devices and update participant", () => {
    // arrange
    const entities = {
      1: {},
    };
    const ids = ["1"];
    const participantID = "123";
    const participant = { id: participantID, audioInputDevices: [] };

    // act
    const generator = enumerateVideoInputDevices();

    // assert
    expect(generator.next().value).toEqual(call(listVideoInputDevices));
    expect(generator.next({ ids, entities, participant }).value).toEqual(
      call(updateDevices, entities, ids, "videoInputDevices")
    );
    expect(generator.next().value).toEqual(call(getVideoInputDevice));
    expect(generator.next().done).toBeTruthy();
  });

  it("should list all video devices", () => {
    // arrange
    const entities = {
      1: {},
    };
    const ids = ["1"];
    const participantID = "123";
    const participant = { id: participantID, videoDevices: [] };

    // act
    const generator = enumerateVideoDevices();

    // assert
    expect(generator.next().value).toEqual(call(listVideoDevices));
    expect(generator.next({ ids, entities }).value).toEqual(
      all(
        Object.entries(entities).map(([id, value]) =>
          put(
            addDevice({
              id,
              data: value,
              entityType: "devices",
            })
          )
        )
      )
    );
    expect(generator.next().value).toEqual(select(getLocalParticipantID));
    expect(generator.next(participantID).value).toEqual(
      select(getParticipant, participantID)
    );
    expect(generator.next(participant).value).toEqual(
      put(
        updateParticipant({
          id: participantID,
          entityType: "participants",
          data: { videoDevices: ["1"] },
        })
      )
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should fail to list all video devices and dispatch an action to store", () => {
    // arrange
    const error = {};

    // act
    const generator = enumerateVideoDevices();

    // assert
    expect(generator.next().value).toEqual(call(listVideoDevices));
    expect(generator.next({ error }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not list video devices",
      })
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should list all audio devices", () => {
    // arrange
    const entities = {
      1: {},
    };
    const ids = ["1"];
    const participantID = "123";
    const participant = { id: participantID, videoDevices: [] };

    // act
    const generator = enumerateAudioDevices();

    // assert
    expect(generator.next().value).toEqual(call(listAudioDevices));
    expect(generator.next({ ids, entities }).value).toEqual(
      all(
        Object.entries(entities).map(([id, value]) =>
          put(
            addDevice({
              id,
              data: value,
              entityType: "devices",
            })
          )
        )
      )
    );
    expect(generator.next().value).toEqual(select(getLocalParticipantID));
    expect(generator.next(participantID).value).toEqual(
      select(getParticipant, participantID)
    );
    expect(generator.next(participant).value).toEqual(
      put(
        updateParticipant({
          id: participantID,
          entityType: "participants",
          data: { audioDevices: ["1"] },
        })
      )
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should fail to  list all audio devices and dispatch an action to store", () => {
    // arrange
    const error = {};

    // act
    const generator = enumerateAudioDevices();

    // assert
    expect(generator.next().value).toEqual(call(listAudioDevices));
    expect(generator.next({ error }).value).toEqual(
      call(displayMessage, {
        type: "error",
        message: "could not list audio devices",
      })
    );

    expect(generator.next().done).toBeTruthy();
  });
});
