import { ILaunch } from "@/types";
import { GraphQLClient, gql } from "graphql-request";
import { NextRequest } from "next/server";

const endpoint = "https://spacex-production.up.railway.app";

const client = new GraphQLClient(endpoint);

const getLaunches = gql`
  query ($limit: Int, $offset: Int, $find: LaunchFind) {
    launches(limit: $limit, offset: $offset, find: $find) {
      id
      launch_date_local
      mission_name
      rocket {
        rocket_name
      }
      launch_site {
        site_name
      }
    }
  }
`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (!searchParams.get("limit") || !searchParams.get("offset")) {
    return Response.json(
      {
        error: "Missing limit or offset",
      },
      { status: 400 }
    );
  }

  if (
    !Number(searchParams.get("limit")) ||
    !Number(searchParams.get("offset"))
  ) {
    return Response.json(
      {
        error: "Invalid limit or offset",
      },
      { status: 400 }
    );
  }

  const limit = Number(searchParams.get("limit"));
  const offset = Number(searchParams.get("offset"));
  const searchTerm = searchParams.get("searchTerm");

  try {
    const request: ILaunch = await client.request(getLaunches, {
      limit,
      offset,
      ...(Boolean(searchTerm) && {
        mission_name: searchParams.get("searchTerm"),
      }),
    });

    let mappedRequest: ILaunch = request;

    if (request.launches.length > 0) {
      const mappedProps = request.launches.map((launch) => {
        if (!launch.launch_site) {
          return {
            ...launch,
            launch_site: {
              site_id: Math.random(),
              site_name: `site-name-${Math.floor(Math.random() * 100)}`,
            },
          };
        }
        return launch;
      });

      mappedRequest = {
        launches: mappedProps,
      };
    }

    return Response.json(mappedRequest);
  } catch (error) {
    Response.json({
      error: "Failed to fetch data",
    });
  }
}
