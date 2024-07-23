"use client";

import { ILaunch, QueryParams } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDebounce } from "@/hooks";

async function fetchLaunches({
  offset,
  limit,
  searchTerm,
}: QueryParams): Promise<ILaunch> {
  const response = await fetch(
    `/api?limit=${limit}&offset=${offset}&searchTerm=${searchTerm}`
  );
  return await response.json();
}

const limit = 5;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["Launches", debouncedSearchTerm],
      queryFn: ({ pageParam }) =>
        fetchLaunches({ ...pageParam, searchTerm: debouncedSearchTerm }),
      initialPageParam: {
        offset: 1,
        limit,
      },
      getNextPageParam: (lastPage, pages) => {
        /**
         * if the last page has less than 10 launches, there is no need to fetch next page
         * it means we have reached the end
         */
        if (lastPage.launches.length < limit) return undefined;

        /**
         * return the offset of the next page
         */
        return {
          offset: pages.length * limit,
          limit,
        };
      },
    });

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const flattenData = useMemo(() => {
    if (!data) return [];
    return data?.pages.flatMap((page) => page.launches);
  }, [data]);

  const handleSearchChange = () => {};

  if (isLoading) return <p>loading...</p>;

  return (
    <main className='container mx-auto py-12 px-4 md:px-6 lg:px-8'>
      <header className='flex flex-col sm:flex-row items-center justify-between'>
        <h1 className='text-3xl w-full font-bold mb-8'>
          Upcoming SpaceX Launches
        </h1>
        <div className='mb-8 w-full flex items-center'>
          <Input
            type='search'
            placeholder='Search by mission name or launch site'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full rounded-lg bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50'
          />
          <Button onClick={handleSearchChange} className='ml-4'>
            Search
          </Button>
        </div>
      </header>

      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {flattenData.map((launch) => (
          <Card
            data-testid='intersection-trigger'
            ref={ref}
            key={launch.id}
            className='bg-card text-card-foreground rounded-lg shadow-lg'
          >
            <CardContent className='p-6'>
              <CardHeader className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-bold'>{launch.mission_name}</h2>
                <div className='text-sm text-muted-foreground'>
                  {new Date(launch.launch_date_local).toDateString()}
                </div>
              </CardHeader>
              <div className='flex items-center justify-between mb-4'>
                <div className='text-sm text-muted-foreground'>Rocket:</div>
                <div className='text-sm font-medium'>
                  {launch.rocket.rocket_name}
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='text-sm text-muted-foreground'>
                  Launch Site:
                </div>
                <div className='text-sm font-medium'>
                  {launch.launch_site.site_name}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
