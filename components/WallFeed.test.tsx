import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WallFeed from "./WallFeed";

describe("Wall composer", () => {
  it("disables blank input and truncates pasted emoji at 280 code points", () => {
    render(<WallFeed query="" />);
    const composer = screen.getByLabelText("Write on the Wall");
    const share = screen.getAllByRole("button", {
      name: "Share",
    })[0];
    expect(share).toBeDisabled();
    fireEvent.change(composer, { target: { value: "   " } });
    expect(share).toBeDisabled();
    fireEvent.change(composer, { target: { value: "😀".repeat(281) } });
    expect(Array.from((composer as HTMLTextAreaElement).value)).toHaveLength(
      280,
    );
    expect(share).toBeEnabled();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("persists a post, places it first, and clears the composer", async () => {
    render(<WallFeed query="" />);
    const composer = screen.getByLabelText("Write on the Wall");
    fireEvent.change(composer, {
      target: { value: "A new post from the test." },
    });
    fireEvent.click(screen.getAllByRole("button", { name: "Share" })[0]);
    await waitFor(() => expect(composer).toHaveValue(""));
    expect(screen.getAllByRole("article")[0]).toHaveTextContent(
      "A new post from the test.",
    );
    expect(
      JSON.parse(localStorage.getItem("facebook-wall-preview-v1")!)[0].body,
    ).toBe("A new post from the test.");
  });

  it("retains the draft when browser storage rejects the write", async () => {
    render(<WallFeed query="" />);
    const composer = screen.getByLabelText("Write on the Wall");
    const write = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("Storage full");
      });
    fireEvent.change(composer, { target: { value: "Keep this draft." } });
    fireEvent.click(screen.getAllByRole("button", { name: "Share" })[0]);
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "could not be shared",
      ),
    );
    expect(composer).toHaveValue("Keep this draft.");
    expect(screen.getAllByRole("button", { name: "Share" })[0]).toBeEnabled();
    write.mockRestore();
  });
});
