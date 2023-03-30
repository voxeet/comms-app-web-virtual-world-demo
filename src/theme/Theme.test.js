import THEME from "./Theme";
import { expect, it } from "vitest";

it("THEME should match the snaphot", () => {
  expect(THEME).toMatchSnapshot();
});
