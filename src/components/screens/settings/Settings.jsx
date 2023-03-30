import React, { useEffect } from "react";

import style from "./Settings.Style";

const Settings = ({
  className,
  videoInputDevices,
  audioOutputDevices,
  audioInputDevices,
  setVideoInput,
  setAudioInput,
  setAudioOutput,
  listAudioInputDevices,
  listAudioOutputDevices,
  listVideoInputDevices,
  selectedAudioInputDeviceId,
  selectedAudioOutputDeviceId,
  selectedVideoInputDeviceId,
  hide,
}) => {
  useEffect(() => {
    listAudioInputDevices();
    listAudioOutputDevices();
    listVideoInputDevices();
  }, [listAudioInputDevices, listAudioOutputDevices, listVideoInputDevices]);

  const selectVideoInputDevice = (id) => {
    setVideoInput(id);
    setTimeout(() => hide(), 250);
  };

  const selectAudioInputDevice = (id) => {
    setAudioInput(id);
    setTimeout(() => hide(), 250);
  };

  const selectAudioOutputDevice = (id) => {
    setAudioOutput(id);
    setTimeout(() => hide(), 250);
  };

  return (
    <div className={className}>
      <h2>media device management :</h2>
      <div className={"device-type"} data-testid="video-input-devices">
        <h3>video input devices :</h3>
        {videoInputDevices &&
          videoInputDevices.map((device, index) => (
            <div
              data-testid="video-input-devices-item"
              className={`device ${
                device.deviceId === selectedVideoInputDeviceId ? "current" : ""
              }`}
              onClick={(event) => {
                event.stopPropagation();
                selectVideoInputDevice(device.deviceId);
              }}
              key={index}
            >
              {device.label}
            </div>
          ))}
      </div>

      <div className={"device-type"} data-testid="audio-input-devices">
        <h3>audio input devices :</h3>
        {audioInputDevices &&
          audioInputDevices.map((device, index) => (
            <div
              data-testid="audio-input-devices-item"
              className={`device ${
                device.deviceId === selectedAudioInputDeviceId ? "current" : ""
              }`}
              onClick={(event) => {
                event.stopPropagation();
                selectAudioInputDevice(device.deviceId);
              }}
              key={index}
            >
              {device.label}
            </div>
          ))}
      </div>

      <div className={"device-type"} data-testid="audio-output-devices">
        <h3>audio output devices :</h3>
        {audioOutputDevices &&
          audioOutputDevices.map((device, index) => (
            <div
              data-testid="audio-output-devices-item"
              className={`device ${
                device.deviceId === selectedAudioOutputDeviceId ? "current" : ""
              }`}
              onClick={(event) => {
                event.stopPropagation();
                selectAudioOutputDevice(device.deviceId);
              }}
              key={index}
            >
              {device.label}
            </div>
          ))}
      </div>
    </div>
  );
};

export default style(Settings);
