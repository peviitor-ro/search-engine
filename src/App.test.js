/** @vitest-environment jsdom */
import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";

test("renders the landing page", () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ total: { jobs: 0 } })
      })
    )
  );

  render(
    React.createElement(
      Provider,
      { store },
      React.createElement(App)
    )
  );

  expect(screen.getByText(/Locul de muncă visat/i)).toBeTruthy();
});
