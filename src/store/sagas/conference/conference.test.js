import {
  create,
  hasVideo,
  join,
  leave,
  startBroadcastVideoOnMainStage,
  startBroadcastVideoOnSecondStage,
  stopBroadcastVideoOnMainStage,
  stopBroadcastVideoOnSecondStage,
} from "./conference";
import {
  createConference,
  getLocalParticipant,
  joinConference,
  leaveConference,
} from "../../services/conference";
import { call, put, select } from "redux-saga/effects";
import {
  addConference,
  addParticipant,
  addStreamToMainStage,
  addStreamToSecondStage,
  removeStreamToMainStage,
  removeStreamToSecondStage,
  updateConference,
} from "../../effects/conference";
import { application } from "../../effects";
import { push } from "redux-first-history";
import { getCurrentConferenceID } from "../../reducers/application/selectors";
import { getEntity } from "../../reducers/entities/selectors";
import { vi, expect, it, describe } from "vitest";
import { getParticipant } from "./audio.js";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("conference test suite", () => {
  it("should return false", () => {
    // arrange
    const streams = [];

    // act
    const video = hasVideo(streams);

    // assert
    expect(video).toBe(false);
  });

  it("should return true", () => {
    // arrange
    const stream = {
      type: "Camera",
      getVideoTracks: () => [{}, {}],
    };
    const streams = [stream];

    // act
    const video = hasVideo(streams);

    // assert
    expect(video).toBe(true);
  });

  it("should create a conference", () => {
    // arrange
    const action = {
      type: "",
      payload: {},
    };

    const conferenceID = "456";
    const conferenceEntities = {
      conferences: {
        456: {},
      },
    };

    const participantID = "123";
    const participantEntities = {
      participants: {
        123: {},
      },
    };

    const constraints = {
      audio: true,
      video: false,
    };

    // act
    const generator = create(action);

    // assert
    expect(generator.next().value).toEqual(call(getLocalParticipant));

    expect(
      generator.next({ participantID, entities: participantEntities }).value
    ).toEqual(
      put(
        addParticipant({
          id: participantID,
          data: participantEntities.participants,
          entityType: "participants",
        })
      )
    );

    expect(generator.next().value).toEqual(
      put(application.setLocalParticipantID({ id: participantID }))
    );

    expect(generator.next().value).toEqual(
      call(createConference, action.payload)
    );

    expect(
      generator.next({ entities: conferenceEntities, conferenceID }).value
    ).toEqual(
      put(
        addConference({
          id: conferenceID,
          data: conferenceEntities.conferences,
          entityType: "conferences",
        })
      )
    );

    expect(generator.next().value).toEqual(
      put(application.setCurrentConferenceID({ id: conferenceID }))
    );

    expect(generator.next().value).toEqual(
      put(
        updateConference({
          id: conferenceID,
          entityType: "conferences",
          data: { participants: [participantID] },
        })
      )
    );

    expect(generator.next(constraints).value).toEqual(
      call(join, { payload: constraints })
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should join a conference", () => {
    // arrange
    const action = {
      type: "",
      payload: {},
    };

    const options = {
      constraints: {},
      spatialAudio: true,
      dvwc: true,
    };

    const alias = "toto";
    const conference = { alias };
    const copy = { ...conference };

    const state = {};
    const currentConferenceID = "123";

    const conferenceID = "123";
    const entities = {
      conferences: {
        123: {
          params: { spatialAudioStyle: "shared" },
        },
      },
    };

    // act
    const generator = join(action);

    // assert
    expect(generator.next().value).toEqual(select());
    expect(generator.next(state).value).toEqual(select(getCurrentConferenceID));
    expect(generator.next(currentConferenceID).value).toEqual(
      call(getEntity, state, "conferences", currentConferenceID)
    );
    expect(generator.next(conference, options, copy).value).toEqual(
      call(joinConference, { conference: copy, options })
    );

    expect(generator.next({ conferenceID, entities }).value).toEqual(
      put(
        updateConference({
          id: conferenceID,
          entityType: "conferences",
          data: { params: entities.conferences[conferenceID].params },
        })
      )
    );

    expect(generator.next().value).toEqual(put(push(`/conference/${alias}`)));
    expect(generator.next().done).toBeTruthy();
  });

  it("should leave conference", () => {
    // act
    const generator = leave();

    // assert
    expect(generator.next().value).toEqual(call(leaveConference));
    expect(generator.next({ error: undefined }).value).toEqual(
      put(application.leaveConference())
    );
    expect(generator.next().value).toEqual(put(push("/conference")));
    expect(generator.next().done).toBeTruthy();
  });

  it("should fail to leave conference ", () => {
    // arrange
    const error = {};

    // act
    const generator = leave();

    // assert
    expect(generator.next().value).toEqual(call(leaveConference));
    expect(generator.next({ error }).done).toBeTruthy();
  });

  it("should not start broadcasting (on main stage) participant video - no participant", () => {
    // arrange
    const action = {
      payload: {
        participantId: "123",
      },
    };

    // act
    const generator = startBroadcastVideoOnMainStage(action);

    // assert
    expect(generator.next().value).toEqual(select());
    expect(generator.next().value).toEqual(select(getCurrentConferenceID));
    expect(generator.next().value).toEqual(
      select(getParticipant, action.payload.participantId)
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should not start broadcasting (on main stage) participant video - no stream", () => {
    // arrange
    const action = {
      payload: {
        participantId: "123",
      },
    };

    const participant = {};

    // act
    const generator = startBroadcastVideoOnMainStage(action);

    // assert
    expect(generator.next().value).toEqual(select());
    expect(generator.next().value).toEqual(select(getCurrentConferenceID));
    expect(generator.next().value).toEqual(
      select(getParticipant, action.payload.participantId)
    );
    expect(generator.next(participant).done).toBeTruthy();
  });

  it("should not start broadcasting (on main stage) participant video - no video", () => {
    // arrange
    const action = {
      payload: {
        participantId: "123",
      },
    };

    const participant = {
      streams: ["123"],
    };
    const streams = [{ type: "Camera", getVideoTracks: () => [] }];

    // act
    const generator = startBroadcastVideoOnMainStage(action);

    // assert
    expect(generator.next().value).toEqual(select());
    expect(generator.next().value).toEqual(select(getCurrentConferenceID));
    expect(generator.next().value).toEqual(
      select(getParticipant, action.payload.participantId)
    );
    expect(generator.next(streams).done).toBeTruthy();
  });

  it("should start broadcasting (on main stage) participant video", () => {
    // arrange
    const action = {
      payload: {
        participantId: "123",
      },
    };

    const participant = {
      streams: ["123"],
    };
    const streams = [{ type: "Camera", getVideoTracks: () => [{}, {}] }];
    const conferenceID = "567";
    const state = {};
    const stream = streams[0];
    const video = true;

    // act
    const generator = startBroadcastVideoOnMainStage(action);

    // assert
    expect(generator.next().value).toEqual(select());
    expect(generator.next(state).value).toEqual(select(getCurrentConferenceID));
    expect(generator.next(conferenceID).value).toEqual(
      select(getParticipant, action.payload.participantId)
    );
    expect(generator.next(participant).value).toEqual(
      call(getEntity, state, "streams", participant.streams[0])
    );
    expect(generator.next(stream).value).toEqual(call(hasVideo, [stream]));
    expect(generator.next(video).value).toEqual(
      put(
        addStreamToMainStage({
          id: conferenceID,
          entityType: "conferences",
          data: {
            mainStageStreams: [participant.streams[0]],
          },
        })
      )
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should not start broadcasting (on second stage) participant video - no participant", () => {
    // arrange
    const action = {
      payload: {
        participantId: "123",
      },
    };

    // act
    const generator = startBroadcastVideoOnSecondStage(action);

    // assert
    expect(generator.next().value).toEqual(select());
    expect(generator.next().value).toEqual(select(getCurrentConferenceID));
    expect(generator.next().value).toEqual(
      select(getParticipant, action.payload.participantId)
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should not start broadcasting (on second stage) participant video - no stream", () => {
    // arrange
    const action = {
      payload: {
        participantId: "123",
      },
    };

    const participant = {};

    // act
    const generator = startBroadcastVideoOnSecondStage(action);

    // assert
    expect(generator.next().value).toEqual(select());
    expect(generator.next().value).toEqual(select(getCurrentConferenceID));
    expect(generator.next().value).toEqual(
      select(getParticipant, action.payload.participantId)
    );
    expect(generator.next(participant).done).toBeTruthy();
  });

  it("should not start broadcasting (on second stage) participant video - no video", () => {
    // arrange
    const action = {
      payload: {
        participantId: "123",
      },
    };

    const participant = {
      streams: ["123"],
    };
    const streams = [{ type: "Camera", getVideoTracks: () => [] }];

    // act
    const generator = startBroadcastVideoOnSecondStage(action);

    // assert
    expect(generator.next().value).toEqual(select());
    expect(generator.next().value).toEqual(select(getCurrentConferenceID));
    expect(generator.next().value).toEqual(
      select(getParticipant, action.payload.participantId)
    );
    expect(generator.next(streams).done).toBeTruthy();
  });

  it("should start broadcasting (on second stage) participant video", () => {
    // arrange
    const action = {
      payload: {
        participantId: "123",
      },
    };

    const participant = {
      streams: ["123"],
    };
    const streams = [{ type: "Camera", getVideoTracks: () => [{}, {}] }];
    const conferenceID = "567";
    const state = {};
    const stream = streams[0];
    const video = true;

    // act
    const generator = startBroadcastVideoOnSecondStage(action);

    // assert
    expect(generator.next().value).toEqual(select());
    expect(generator.next(state).value).toEqual(select(getCurrentConferenceID));
    expect(generator.next(conferenceID).value).toEqual(
      select(getParticipant, action.payload.participantId)
    );
    expect(generator.next(participant).value).toEqual(
      call(getEntity, state, "streams", participant.streams[0])
    );
    expect(generator.next(stream).value).toEqual(call(hasVideo, [stream]));
    expect(generator.next(video).value).toEqual(
      put(
        addStreamToSecondStage({
          id: conferenceID,
          entityType: "conferences",
          data: {
            secondStageStreams: [participant.streams[0]],
          },
        })
      )
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should dispatch an action to the store", () => {
    // arrange
    const action = { payload: {} };
    const conferenceID = "234";

    // act
    const generator = stopBroadcastVideoOnSecondStage(action);

    // assert
    expect(generator.next().value).toEqual(select(getCurrentConferenceID));
    expect(generator.next(conferenceID).value).toEqual(
      put(
        removeStreamToSecondStage({
          id: conferenceID,
          entityType: "conferences",
          data: {
            secondStageStreams: [],
          },
        })
      )
    );
    expect(generator.next().done).toBeTruthy();
  });

  it("should dispatch an action to the store", () => {
    // arrange
    const action = { payload: {} };
    const conferenceID = "234";

    // act
    const generator = stopBroadcastVideoOnMainStage(action);

    // assert
    expect(generator.next().value).toEqual(select(getCurrentConferenceID));
    expect(generator.next(conferenceID).value).toEqual(
      put(
        removeStreamToMainStage({
          id: conferenceID,
          entityType: "conferences",
          data: {
            mainStageStreams: [],
          },
        })
      )
    );
    expect(generator.next().done).toBeTruthy();
  });
});
