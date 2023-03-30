import { expect, it } from "vitest";
import reducer from "./authentication";

it("dispatch setToken action, reducer should save token", () => {
  // arrange
  const token = "token";
  const action = { type: "SET_TOKEN", payload: { token } };
  const state = { token: "" };

  // act
  const updatedState = reducer(state, action);

  //assert
  expect(updatedState).toMatchSnapshot();
});
