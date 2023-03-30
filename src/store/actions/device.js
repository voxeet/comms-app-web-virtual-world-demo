import { createAction } from "../utils/store";

export const listAudioDevices = createAction("LIST_AUDIO_DEVICES");
export const listVideoDevices = createAction("LIST_VIDEO_DEVICES");
export const setAudioInput = createAction("SET_AUDIO_INPUT");
export const setAudioOutput = createAction("SET_AUDIO_OUTPUT");
export const setVideoInput = createAction("SET_VIDEO_INPUT");
export const getVideoInputDevice = createAction("GET_VIDEO_INPUT_DEVICE");
export const getAudioInputDevice = createAction("GET_AUDIO_INPUT_DEVICE");
export const getAudioOutputDevice = createAction("GET_AUDIO-OUTPUT_DEVICE");
export const listVideoInputDevices = createAction("LIST_VIDEO_INPUT_DEVICES");
export const listAudioInputDevices = createAction("LIST_AUDIO_INPUT_DEVICES");
export const listAudioOutputDevices = createAction("LIST_AUDIO_OUTPUT_DEVICES");
