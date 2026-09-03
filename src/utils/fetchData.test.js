import { describe, it, expect, vi, afterEach } from "vitest";
import { getData } from "./fetchData";

describe("getData", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws on network failures so callers can keep cached results or show an offline message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("NetworkError: offline")))
    );

    await expect(getData("q=qa&page=2")).rejects.toThrow("offline");
  });
});
