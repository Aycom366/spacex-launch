export interface ILaunch {
  launches: {
    id: string;
    launch_date_local: Date;
    launch_site: { site_name: string; site_id: number };
    mission_name: string;
    rocket: { rocket_name: string };
  }[];
}

export interface QueryParams {
  limit: number;
  offset: number;
  searchTerm?: string;
}
