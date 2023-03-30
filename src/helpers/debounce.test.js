import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { debounce } from "./debounce";

describe("debounce helper function test suite", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("fn should be called only once", () => {
    const fn = vi.fn();
    const wait = 1000;
    const args = "toto";

    const debouncedFn = debounce(fn, wait);

    debouncedFn(args);
    expect(fn).not.toBeCalled();

    vi.advanceTimersByTime(500);
    expect(fn).not.toBeCalled();

    debouncedFn(args);
    expect(fn).not.toBeCalled();

    vi.advanceTimersByTime(1500);
    expect(fn).toHaveBeenCalledWith(args);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
