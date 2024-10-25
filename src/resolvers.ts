import axios from "axios";
import { API_KEY } from "./config.js";
import { DatabaseSync } from "node:sqlite";
import { parse, differenceInDays, isAfter, isBefore, addYears } from "date-fns";

interface Context {
  database: DatabaseSync;
}

const resolvers = {
  Query: {
    asteroids: async (_: any, { startDate, endDate }: any) => {
      try {
        const start = parse(startDate);
        const end = parse(endDate);

        const diffDays = differenceInDays(end, start) + 1;

        if (diffDays > 7) {
          throw new Error("Date range cannot exceed 7 days.");
        }

        const response = await axios.get(
          "https://api.nasa.gov/neo/rest/v1/feed",
          {
            params: {
              start_date: startDate,
              end_date: endDate,
              api_key: API_KEY,
            },
          }
        );

        const nearEarthObjects = response.data.near_earth_objects;
        let asteroids: any[] = [];
        Object.values(nearEarthObjects).forEach((date: any) => {
          asteroids = asteroids.concat(date);
        });

        return asteroids.map((asteroid) => ({
          id: asteroid.id,
          name: asteroid.name,
        }));
      } catch (error: any) {
        console.error("Error fetching asteroids:", error.message);
        throw new Error(error.response?.data?.error_message || error.message);
      }
    },
    asteroid: async (_: any, { id }: any) => {
      try {
        const response = await axios.get(
          `https://api.nasa.gov/neo/rest/v1/neo/${id}`,
          {
            params: {
              api_key: API_KEY,
            },
          }
        );
        const asteroid = response.data;

        const today = new Date();
        const yearsRange = 1;
        const startRange = addYears(today, -yearsRange);
        const endRange = addYears(today, yearsRange);

        const filteredCloseApproachData = asteroid.close_approach_data.filter(
          (cad: any) => {
            const approachDate = parse(cad.close_approach_date_full);
            return (
              isAfter(approachDate, startRange) &&
              isBefore(approachDate, endRange)
            );
          }
        );

        return {
          id: asteroid.id,
          name: asteroid.name,
          nasa_jpl_url: asteroid.nasa_jpl_url,
          absolute_magnitude_h: asteroid.absolute_magnitude_h,
          estimated_diameter: asteroid.estimated_diameter,
          is_potentially_hazardous_asteroid:
            asteroid.is_potentially_hazardous_asteroid,
          close_approach_data: asteroid.close_approach_data,
        };
      } catch (error: any) {
        console.error("Error fetching asteroid details:", error.message);
        throw new Error("Failed to fetch asteroid details.");
      }
    },
    favourites: async (_: any, __: any, { database }: Context) => {
      const statement = database.prepare("SELECT asteroid_id FROM favourites");
      const rows = statement.all();
      const ids = rows.map((row: any) => row.asteroid_id);
      const asteroids = await Promise.all(
        ids.map(async (id: string) => {
          const response = await axios.get(
            `https://api.nasa.gov/neo/rest/v1/neo/${id}`,
            {
              params: {
                api_key: API_KEY,
              },
            }
          );
          return {
            id: response.data.id,
            name: response.data.name,
          };
        })
      );
      return asteroids;
    },
  },
  Mutation: {
    addFavourite: async (_: any, { id }: any, { database }: Context) => {
      const insert = database.prepare(
        "INSERT OR IGNORE INTO favourites (asteroid_id) VALUES (?)"
      );
      insert.run(id);

      const response = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/neo/${id}`,
        {
          params: {
            api_key: API_KEY,
          },
        }
      );
      const asteroid = response.data;
      return {
        id: asteroid.id,
        name: asteroid.name,
      };
    },
    removeFavourite: async (_: any, { id }: any, { database }: Context) => {
      const del = database.prepare(
        "DELETE FROM favourites WHERE asteroid_id = ?"
      );
      del.run(id);
      return { id };
    },
  },
};

export default resolvers;
