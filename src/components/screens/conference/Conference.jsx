import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";

import style from "./Conference.Style";
import Commands from "../../../containers/Commands";
import useModal from "../../hooks/useModal";
import Modal from "../../technical/modal/Modal";
import Settings from "../../../containers/Settings";
import ThreeDimensionalScene from "../../technical/3DSpatialScene/3DSpatialScene";
import Messages from "../../../containers/Messages";

const Conference = ({
  localParticipantId,
  remoteParticipantIds,
  screenShareStreamId,
  mainStageStreamId,
  secondStageStreamId,
  setSpatialEnvironment,
  className,
}) => {
  const { isShowing, toggle } = useModal();

  return (
    <div className={className}>
      <div className={"conference-wrapper"}>
        <AutoSizer>
          {({ width, height }) => (
            <ThreeDimensionalScene
              data-testid="scene"
              localParticipantId={localParticipantId}
              remoteParticipantIds={remoteParticipantIds}
              screenShareStreamId={screenShareStreamId}
              mainStageStreamId={mainStageStreamId}
              secondStageStreamId={secondStageStreamId}
              setSpatialEnvironment={setSpatialEnvironment}
              width={width}
              height={height}
            />
          )}
        </AutoSizer>
      </div>

      <div className={"main-commands-wrapper"}>
        <Commands data-testid="commands" displayModal={toggle} />
      </div>

      <Modal data-testid="modal" isShowing={isShowing} hide={toggle}>
        <Settings hide={toggle} />
      </Modal>

      <Messages autoDelete autoDeleteTime={3000} />
    </div>
  );
};

export default style(Conference);
