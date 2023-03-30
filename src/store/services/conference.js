import VoxeetSDK from "@voxeet/voxeet-web-sdk";
import { normalize, schema } from "normalizr";
import pick from "lodash.pick";

export const createConference = async (payload) => {
  try {
    const conference = await VoxeetSDK.conference.create(payload);
    const conferenceSchema = new schema.Entity(
      "conferences",
      {},
      {
        idAttribute: "id",
        processStrategy: (entity) => pick(entity, ["alias", "pinCode", "id"]),
      }
    );

    const normalizedData = normalize(conference, conferenceSchema);

    return {
      conferenceID: normalizedData.result,
      entities: normalizedData.entities,
    };
  } catch (error) {
    return { error };
  }
};

export const getLocalParticipant = () => {
  try {
    const participant = VoxeetSDK.session.participant;

    const participantSchema = new schema.Entity(
      "participants",
      {},
      {
        idAttribute: "id",
        processStrategy: (entity) => {
          const val = pick(entity, ["type", "id"]);
          return { ...val, name: entity.info.name };
        },
      }
    );
    const normalizedData = normalize(participant, participantSchema);

    return {
      participantID: normalizedData.result,
      entities: normalizedData.entities,
    };
  } catch (error) {
    return { error };
  }
};

export const joinConference = async ({ conference, options }) => {
  try {
    const joinedConference = await VoxeetSDK.conference.join(
      conference,
      options
    );

    const conferenceSchema = new schema.Entity(
      "conferences",
      {},
      {
        idAttribute: "id",
        processStrategy: (entity) =>
          pick(entity, ["alias", "pinCode", "id", "params"]),
      }
    );

    const normalizedData = normalize(joinedConference, conferenceSchema);
    return {
      conferenceID: normalizedData.result,
      entities: normalizedData.entities,
    };
  } catch (error) {
    return { error };
  }
};

export const leaveConference = () => {
  return VoxeetSDK.conference
    .leave()
    .then((response) => ({ response }))
    .catch((error) => ({ error }));
};
