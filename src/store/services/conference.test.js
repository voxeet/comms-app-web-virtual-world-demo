import { describe, it, expect, vi, afterEach } from "vitest";
import {
  createConference,
  leaveConference,
  joinConference,
  getLocalParticipant,
} from "./conference";

const mockLeave = vi.fn();
const mockCreate = vi.fn();
const mockJoin = vi.fn();
const localParticipant = { id: "123", type: "user", info: { name: "toto" } };

vi.mock("@voxeet/voxeet-web-sdk", () => ({
  default: {
    get conference() {
      return { leave: mockLeave, create: mockCreate, join: mockJoin };
    },
    get session() {
      return {
        get participant() {
          return localParticipant;
        },
      };
    },
  },
}));

describe("conference service test suite", () => {
  afterEach(() => {
    mockLeave.mockClear();
  });

  it("should reject a promise", async () => {
    // arrange
    mockLeave.mockRejectedValueOnce(new Error("error"));

    // act
    const { error, response } = await leaveConference();

    // assert
    expect(error.message).toBe("error");
    expect(mockLeave).toHaveBeenCalledTimes(1);
    expect(response).toBe(undefined);
  });

  it("should return a resolved promise", async () => {
    // arrange
    mockLeave.mockResolvedValue({ response: {} });

    // act
    const { response, error } = await leaveConference();

    // assert
    expect(error).toBe(undefined);
    expect(response).toMatchSnapshot();
  });

  it("should return the normalized local participant", () => {
    // act
    const { participantID, entities, error } = getLocalParticipant();

    // assert
    expect(participantID).toBe("123");
    expect(error).toBe(undefined);
    expect(entities).toMatchSnapshot();
  });

  it("should return a promise containing a normalized conference", async () => {
    // arrange
    mockCreate.mockResolvedValue({
      id: "123",
      alias: "conference",
      pinCode: "456",
    });

    const options = { key: "value" };

    // act
    const { conferenceID, entities, error } = await createConference(options);

    // assert
    expect(error).toBe(undefined);
    expect(conferenceID).toBe("123");
    expect(entities).toMatchSnapshot();
  });

  it("should resolve a promise containing an error", async () => {
    // arrange
    mockCreate.mockRejectedValueOnce(new Error("error"));
    const options = { key: "value" };

    // act
    const { error, entities, conferenceID } = await createConference(options);

    // assert
    expect(error.message).toBe("error");
    expect(entities).toBe(undefined);
    expect(conferenceID).toBe(undefined);
  });

  it("should return a promise containing a normalized conference", async () => {
    // arrange
    mockJoin.mockResolvedValue({
      id: "123",
      alias: "conference",
      pinCode: "456",
    });

    const options = { key: "value" };
    const conference = { id: "123", alias: "conference", pinCode: "456" };

    // act
    const { conferenceID, entities, error } = await joinConference({
      conference,
      options,
    });

    // assert
    expect(error).toBe(undefined);
    expect(conferenceID).toBe("123");
    expect(entities).toMatchSnapshot();
    expect(mockJoin).toHaveBeenCalledWith(conference, options);
  });

  it("should resolve a promise containing an error", async () => {
    // arrange
    mockJoin.mockRejectedValueOnce(new Error("error"));
    const options = { key: "value" };
    const conference = { id: "123", alias: "conference", pinCode: "456" };

    // act
    const { error, entities, conferenceID } = await joinConference({
      conference,
      options,
    });

    // assert
    expect(error.message).toBe("error");
    expect(entities).toBe(undefined);
    expect(conferenceID).toBe(undefined);
    expect(mockJoin).toHaveBeenCalledWith(conference, options);
  });
});
