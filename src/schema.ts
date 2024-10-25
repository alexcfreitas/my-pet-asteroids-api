import { gql } from "apollo-server-express";

const typeDefs = gql`
  type EstimatedDiameter {
    kilometers: SizeRange
    meters: SizeRange
    miles: SizeRange
    feet: SizeRange
  }

  type SizeRange {
    estimated_diameter_min: Float
    estimated_diameter_max: Float
  }

  type RelativeVelocity {
    kilometers_per_second: String
    kilometers_per_hour: String
    miles_per_hour: String
  }

  type MissDistance {
    astronomical: String
    lunar: String
    kilometers: String
    miles: String
  }

  type CloseApproachData {
    close_approach_date: String
    close_approach_date_full: String
    epoch_date_close_approach: Float
    relative_velocity: RelativeVelocity
    miss_distance: MissDistance
    orbiting_body: String
  }

  type Asteroid {
    id: String!
    name: String!
    nasa_jpl_url: String
    absolute_magnitude_h: Float
    estimated_diameter: EstimatedDiameter
    is_potentially_hazardous_asteroid: Boolean
    close_approach_data: [CloseApproachData]
  }

  type Query {
    asteroids(startDate: String!, endDate: String!): [Asteroid]
    asteroid(id: String!): Asteroid
    favourites: [Asteroid]
  }

  type Mutation {
    addFavourite(id: String!): Asteroid
    removeFavourite(id: String!): Asteroid
  }
`;

export default typeDefs;
