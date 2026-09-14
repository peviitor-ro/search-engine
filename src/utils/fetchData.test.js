import { describe, it, expect, vi, afterEach } from "vitest";
import { getData } from "./fetchData";

describe("getData", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("throws on network failures so callers can keep cached results or show an offline message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("Failed to fetch")))
    );

    await expect(getData("q=qa&page=2")).rejects.toThrow("Unable to reach");
  });

  it("returns fresh sessionStorage data when the network is unavailable", async () => {
    const storage = new Map();
    vi.stubGlobal("sessionStorage", {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key)
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              response: { docs: [{ id: 1 }], numFound: 1 }
            })
        })
      )
    );

    await expect(getData("q=qa&page=1")).resolves.toEqual({
      jobs: [{ id: 1 }],
      total: 1
    });

    fetch.mockRejectedValueOnce(new Error("offline"));
    await expect(getData("q=qa&page=1")).resolves.toEqual({
      jobs: [{ id: 1 }],
      total: 1
    });
  });

  it("ignores expired sessionStorage data", async () => {
    const storage = new Map([
      [
        "search-engine:jobs:q=qa&page=1",
        JSON.stringify({
          jobs: [{ id: 1 }],
          total: 1,
          timestamp: Date.now() - 24 * 60 * 60 * 1000 - 1
        })
      ]
    ]);
    vi.stubGlobal("sessionStorage", {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key)
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("offline")))
    );

    await expect(getData("q=qa&page=1")).rejects.toThrow("Unable to reach");
    expect(storage.has("search-engine:jobs:q=qa&page=1")).toBe(false);
  });

  it("does not treat invalid backend responses as offline", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: "Solr failed" })
        })
      )
    );

    await expect(getData("q=qa&page=1")).rejects.toThrow("Solr failed");
  });
});
