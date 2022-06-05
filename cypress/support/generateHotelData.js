import {faker} from "@faker-js/faker";

export function generateHotelData() {
  return {
    name: faker.company.companyName(),
    city: faker.address.city(),
    address: faker.address.streetAddress()
  }
}
