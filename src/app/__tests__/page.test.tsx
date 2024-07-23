import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Page from "../page";
import { TanstackProvider } from "@/lib/tanstack-provider";
import { handlers } from "./test-server";
import { setupServer } from "msw/node";

const mockServer = setupServer(...handlers);

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

describe("Page", () => {
  it("should render loading and after some time, remove the loading", async () => {
    render(
      <TanstackProvider>
        <Page />
      </TanstackProvider>
    );

    //ensure loading paragraph is displayed
    const loadingParagraph = screen.getByText(/loading.../i);
    expect(loadingParagraph).toBeInTheDocument();

    //wait for 5 mins until the loading paragraph disappears
    await waitFor(
      () => expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument(),
      { timeout: 5000 }
    );

    const upcomingSpaceXHeading = screen.getByText(/upcoming spaceX/i);
    expect(upcomingSpaceXHeading).toBeInTheDocument();
  });

  it("should fetch and load fetched data", async () => {
    render(
      <TanstackProvider>
        <Page />
      </TanstackProvider>
    );

    const initialLaunches = await screen.findAllByRole("heading", { level: 2 });
    expect(initialLaunches).toHaveLength(5);

    fireEvent.scroll(window, { target: { scrollY: 10000 } });

    await waitFor(() => {
      expect(screen.getByText(/Moon Next/i)).toBeInTheDocument();
    });
  });
});
