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
      screen.getByRole("heading", { name: /picture manager/i }),
    ).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: /print page/i }));

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  test("shows the print preview panel", () => {
    render(<App />);

    expect(
      screen.getAllByRole("heading", { name: /print preview/i }).length,
    ).toBeGreaterThan(0);
  });
});
