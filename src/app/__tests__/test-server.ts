/**
 * see @link https://testing-library.com/docs/react-testing-library/example-intro#full-example
 */
import { http, HttpResponse } from "msw";

const mockLaunches = [
  {
    id: "1",
    launch_date_local: "2024-07-20T12:00:00Z",
    mission_name: "FalconSat",
    rocket: { rocket_name: "Falcon 1" },
    launch_site: { site_name: "Kwajalein Atoll" },
  },
  {
    id: "2",
    launch_date_local: "2024-08-15T13:00:00Z",
    mission_name: "DemoSat",
    rocket: { rocket_name: "Falcon 1" },
    launch_site: { site_name: "Kwajalein Atoll" },
  },
  {
    id: "3",
    launch_date_local: "2024-08-22T13:00:00Z",
    mission_name: "Test Launch",
    rocket: { rocket_name: "Falcon 9" },
    launch_site: { site_name: "Cape Canaveral" },
  },
  {
    id: "4",
    launch_date_local: "2024-09-01T14:00:00Z",
    mission_name: "Starlink",
    rocket: { rocket_name: "Falcon Heavy" },
    launch_site: { site_name: "Vandenberg" },
  },
  {
    id: "5",
    launch_date_local: "2024-09-10T15:00:00Z",
    mission_name: "Moon Mission",
    rocket: { rocket_name: "Falcon Heavy" },
    launch_site: { site_name: "Kennedy Space Center" },
  },
  {
    id: "6",
    launch_date_local: "2024-09-10T15:00:00Z",
    mission_name: "Moon Next",
    rocket: { rocket_name: "Falcon Heavy" },
    launch_site: { site_name: "Kennedy Space Center" },
  },
];

export const handlers = [
  http.get("/api", ({ request }) => {
    /**
     * see @link https://mswjs.io/docs/recipes/query-parameters/#read-a-single-parameter
     */
    const url = new URL(request.url);

    const limit = Number(url.searchParams.get("limit"));
    const offset = Number(url.searchParams.get("offset"));

    let filteredLaunches = mockLaunches;
    const paginatedLaunches = filteredLaunches.slice(offset, offset + limit);

    return HttpResponse.json({ launches: paginatedLaunches });
  }),
];
