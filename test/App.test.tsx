import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import App from "../src/App";

describe("App", () => {
  test("shows the print layout interface and can open the print prompt", () => {
    const printSpy = vi
      .spyOn(window, "print")
      .mockImplementation(() => undefined);

    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /arrange photos, shape the page, and print directly from the browser/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /upload pictures/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /print page/i }));

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  test("shows the advanced YAML panel", () => {
    render(<App />);

    expect(
      screen.getAllByRole("heading", { name: /intermediate yaml/i }),
    ).not.toHaveLength(0);
    expect(screen.getAllByText(/generated from blockly/i)).not.toHaveLength(0);
  });
});
