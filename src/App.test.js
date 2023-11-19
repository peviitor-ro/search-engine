import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./state/store";

test("renders learn react link", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(screen.getByText(/viitor/i)).toBeInTheDocument();
});
