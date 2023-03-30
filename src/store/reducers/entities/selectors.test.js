import {
  getEntities,
  getEntity,
  getValidEntities,
  getValueFrom,
} from "./selectors";
import { IsLoading, NotFoundEntity } from "../../../dataDefinitions/defect";
import { describe, it, expect } from "vitest";

describe("selectors it( suite", () => {
  it("should return isLoading", () => {
    // 1- arrange
    const state = {};
    const entityType = "type";
    const id = "loading";

    // 2- act
    const entity = getEntity(state, entityType, id);

    // 3- assert
    expect(entity).toBe(IsLoading);
  });

  it("should return NotFoundEntity", () => {
    // 1- arrange
    const state = {
      entities: {
        firstType: {
          1: { prop1: 1 },
        },
      },
    };
    const entityType = "firstType";
    const id = "2";

    // 2- act
    const entity = getEntity(state, entityType, id);

    // 3- assert
    expect(entity).toBe(NotFoundEntity);
  });

  it("should return selected entity", () => {
    // 1- arrange
    const state = {
      entities: {
        firstType: {
          1: { prop1: 1 },
        },
      },
    };
    const entityType = "firstType";
    const id = "1";

    // 2- act
    const entity = getEntity(state, entityType, id);

    // 3- assert
    expect(entity).toMatchSnapshot();
  });

  it("should return an empty array", () => {
    // 1- arrange
    const state = {
      entities: {
        firstType: {
          1: { prop1: 1 },
          2: { prop1: 2 },
          3: { prop1: 2 },
          4: { prop1: 2 },
        },
      },
    };
    const entityType = "firstType";

    // 2- act
    const entities = getEntities(state, entityType, 1);

    // 3- assert
    expect(entities).toEqual([]);
  });

  it("should return an array of selected entities", () => {
    // 1- arrange
    const state = {
      entities: {
        firstType: {
          1: { prop1: 1 },
          2: { prop1: 2 },
          3: { prop1: 2 },
          4: { prop1: 2 },
        },
      },
    };
    const entityType = "firstType";
    const ids = ["1", "3"];

    // 2- act
    const entities = getEntities(state, entityType, ids);

    // 3- assert
    expect(entities).toMatchSnapshot();
  });

  it("should return an array of selected entities", () => {
    // 1- arrange
    const state = {
      entities: {
        firstType: {
          1: { prop1: 1 },
          2: { prop1: 2 },
          3: { prop1: 2 },
          4: { prop1: 2 },
        },
      },
    };
    const entityType = "firstType";
    const ids = ["1", "3"];

    // 2- act
    const entities = getValidEntities(state, entityType, ids);

    // 3- assert
    expect(entities).toMatchSnapshot();
  });

  it("should return 1", () => {
    // arrange
    const object = {
      prop1: 1,
    };

    // act
    const value = getValueFrom(object, "prop1");

    // assert
    expect(value).toBe(1);
  });

  it("should return NotFoundEntity", () => {
    // arrange
    const object = {
      prop1: 1,
    };

    // act
    const value = getValueFrom(object, "prop2");

    // assert
    expect(value).toBe(NotFoundEntity);
  });
});
