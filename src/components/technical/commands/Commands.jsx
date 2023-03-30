import React, { useEffect } from "react";
import {
  Mic,
  MicOff,
  Cast,
  Video,
  VideoOff,
  LogOut,
  Circle,
  Settings,
} from "@styled-icons/feather";
import useSound from "use-sound";

import style from "./Commands.Style";

import notification from "./notification.mp3";

const ActionButton = ({ className, children, action, ...rest }) => (
  <div
    className={className}
    {...rest}
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();
      action();
    }}
  >
    {children}
  </div>
);

const Commands = ({
  className,
  leave,
  record,
  stopRecording,
  startVideo,
  stopVideo,
  localParticipantID,
  startAudio,
  stopAudio,
  hasAudio,
  hasVideo,
  recording,
  startScreenShare,
  stopScreenShare,
  screenSharing,
  displayModal,
}) => {
  const [play] = useSound(notification, { volume: 1 });

  useEffect(() => {
    if (recording) play();
  }, [recording, play]);

  const handleVideo = () => {
    hasVideo ? stopVideo(localParticipantID) : startVideo(localParticipantID);
  };

  const handleAudio = () => {
    hasAudio ? stopAudio(localParticipantID) : startAudio(localParticipantID);
  };

  const handleRecording = () => {
    recording ? stopRecording() : record();
  };

  const handleScreenSharing = () => {
    screenSharing ? stopScreenShare() : startScreenShare();
  };

  return (
    <div className={className}>
      <ActionButton action={handleVideo}>
        {hasVideo ? (
          <Video className={`video-${hasVideo ? "on" : "off"}`} />
        ) : (
          <VideoOff />
        )}
      </ActionButton>
      <ActionButton action={handleAudio}>
        {hasAudio ? (
          <Mic className={`audio-${hasAudio ? "on" : "off"}`} />
        ) : (
          <MicOff />
        )}
      </ActionButton>
      <ActionButton action={handleRecording}>
        <Circle className={`recording-${recording ? "on" : "off"}`} />
      </ActionButton>
      <ActionButton action={handleScreenSharing}>
        <Cast className={`screen-sharing-${screenSharing ? "on" : "off"}`} />
      </ActionButton>
      <ActionButton action={displayModal}>
        <Settings />
      </ActionButton>
      <ActionButton action={leave}>
        <LogOut />
      </ActionButton>
    </div>
  );
};

export default style(Commands);
