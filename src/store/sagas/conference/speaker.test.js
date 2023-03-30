import { bgSync, watchParticipant } from "./speaker";
import { cancel, fork, race, take } from "redux-saga/effects";
import { application, conference } from "../../effects";
import { createMockTask } from "@redux-saga/testing-utils";
import { vi, describe, it, expect } from "vitest";

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {},
}));

describe("speaker test suite", () => {
  it("should stop watching participant - ends action dispatched", () => {
    const id = "1";
    const payload = {
      data: {
        [id]: { id, info: { name: "toto" } },
      },
      id,
    };

    const bgSyncTask = createMockTask();

    const generator = watchParticipant({ payload });
    expect(generator.next().value).toEqual(fork(bgSync, payload.data[id]));
    expect(generator.next(bgSyncTask).value).toEqual(
      race({
        update: take(conference.updateParticipant),
        remove: take(conference.removeParticipant),
        ends: take([
          conference.ended,
          conference.left,
          application.leaveConference,
        ]),
      })
    );
    expect(generator.next({ ends: true }).value).toEqual(cancel(bgSyncTask));
    expect(generator.next().done).toBeTruthy();
  });

  it("should stop watching participant - participant left", () => {
    const id = "1";
    const payload = {
      data: {
        [id]: { id, info: { name: "toto" } },
      },
      id,
    };

    const bgSyncTask = createMockTask();
    const update = { payload: { id: "1", data: { status: "Left" } } };

    const generator = watchParticipant({ payload });
    expect(generator.next().value).toEqual(fork(bgSync, payload.data[id]));
    expect(generator.next(bgSyncTask).value).toEqual(
      race({
        update: take(conference.updateParticipant),
        remove: take(conference.removeParticipant),
        ends: take([
          conference.ended,
          conference.left,
          application.leaveConference,
        ]),
      })
    );
    expect(
      generator.next({
        update,
      }).value
    ).toEqual(cancel(bgSyncTask));
    expect(generator.next().done).toBeTruthy();
  });
});
