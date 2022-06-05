import {faker} from "@faker-js/faker";

export function generateRoomData(hotelId) {
  return {
    cost: faker.random.numeric(2),
    floor: faker.random.numeric(1),
    hotelId: hotelId,
    number: faker.random.numeric(3),
    numberOfPlaces: faker.random.numeric(1)
  }
}
