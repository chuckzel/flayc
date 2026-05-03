import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import App from "../src/App";

describe("App", () => {
  test("increments the counter when the button is clicked", () => {
    render(<App />);

    const button = screen.getByRole("button", { name: /count is 0/i });

    fireEvent.click(button);

    expect(
      screen.getByRole("button", { name: /count is 1/i }),
    ).toBeInTheDocument();
  });
});
