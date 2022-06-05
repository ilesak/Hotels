import {faker} from '@faker-js/faker';
import ApiServices from '../../support/apiService';
import {generateHotelData} from "../../support/generateHotelData";
import {generateRoomData} from "../../support/generateRoomData";

const {_} = Cypress;

describe('Hotels tests', () => {
  let hotelData, hotelId, roomDataArr;
  let hotelDataForUITest = {
    name: faker.company.companyName(),
    city: faker.address.city(),
    address: faker.address.streetAddress()
  }

  let roomDataForUITest = {
    roomNumber: faker.random.numeric(2),
    roomFloor: faker.random.numeric(1),
    cost: faker.random.numeric(3),
    numberOfPlaces: faker.random.numeric(1)
  }

  beforeEach(() => {
    cy.clearLocalStorage()
    ApiServices.getAccessToken()
      .then(() => {
        ApiServices.deleteHotels()

        hotelData = generateHotelData()

        return ApiServices.createHotel(hotelData)
      })
      .then(({body}) => {
        hotelId = body.id

        roomDataArr = new Array(1).fill(null).map(() => generateRoomData(hotelId))
        return Promise.all(roomDataArr.map(data => ApiServices.createRoom(data)))
      })

    cy.login()
  })

  it('С181 Create new hotel', () => {
    cy.intercept("POST", "https://hotels-back.herokuapp.com/hotel").as("createHotel")
    cy.intercept("GET", "https://hotels-back.herokuapp.com/hotel/user/*").as("getUserData")

    cy.contains("Hotels").click()
    cy.get('.v-toolbar__title').should("contain", "Hotels").and("be.visible")
    cy.get('.v-btn__content').contains("Create").click()
    cy.get('.v-toolbar__title').should("contain", "Add hotel").and("be.visible")
    cy.get("[aria-label='Name']").type(hotelDataForUITest.name)
    cy.get("[aria-label='City']").type(hotelDataForUITest.city)
    cy.get("[aria-label='Address']").type(hotelDataForUITest.address)
    cy.get('.v-btn__content').contains("Create hotel").click()
    cy.wait("@createHotel")
    cy.wait("@getUserData")
    cy.contains(hotelDataForUITest.name).should("be.visible")
    cy.contains(hotelDataForUITest.name).parents(".v-card").find("a").contains("Edit").click()
    cy.contains("Hotel title").parent().should("contain", hotelDataForUITest.name)
    cy.contains("Hotel address").parent().should("contain", hotelDataForUITest.address)

  })

  it('С182 Edit hotel', () => {
    cy.intercept("POST", "https://hotels-back.herokuapp.com/hotel").as("createHotel")
    cy.intercept("GET", "https://hotels-back.herokuapp.com/hotel/user/*").as("getUserData")

    cy.contains("Hotels").click()
    cy.get('.v-toolbar__title').should("contain", "Hotels").and("be.visible")
    cy.contains(hotelData.name).should("be.visible")
    cy.contains(hotelData.name).parents(".v-card").find("a").contains("Edit").click()
    cy.get('.h-edit-hotel > .v-btn').click()
    cy.get(".v-dialog--active").within(() => {
      cy.get("[aria-label='Room number']").type(roomDataForUITest.roomNumber)
      cy.get("[aria-label='Room floor']").type(roomDataForUITest.roomFloor)
      cy.get("[aria-label='Cost']").type(roomDataForUITest.cost)
      cy.get("[aria-label='Number of places']").type(roomDataForUITest.numberOfPlaces)
      cy.get('.v-btn__content').contains("Save").click()
    })
    cy.get(".h-floor").should("contain", `Floor #${roomDataForUITest.roomFloor}`)
    cy.get(".h-room").should("contain", roomDataForUITest.roomNumber)
  })

  it('С183 Add second hotel room', () => {
    cy.intercept("POST", "https://hotels-back.herokuapp.com/hotel").as("createHotel")
    cy.intercept("GET", "https://hotels-back.herokuapp.com/hotel/user/*").as("getUserData")

    cy.contains("Hotels").click()
    cy.get('.v-toolbar__title').should("contain", "Hotels").and("be.visible")

    cy.contains(hotelData.name).should("be.visible")
    cy.contains(hotelData.name).parents(".v-card").find("a").contains("Edit").click()
    cy.get('.h-edit-hotel > .v-btn').click()
    cy.get(".v-dialog--active").within(() => {
      cy.get("[aria-label='Room number']").type(roomDataForUITest.roomNumber)
      cy.get("[aria-label='Room floor']").type(roomDataForUITest.roomFloor)
      cy.get("[aria-label='Cost']").type(roomDataForUITest.cost)
      cy.get("[aria-label='Number of places']").type(roomDataForUITest.numberOfPlaces)
      cy.get('.v-btn__content').contains("Save").click()
    })
    cy.get(".h-floor").should("contain", `Floor #${roomDataForUITest.roomFloor}`)
    cy.get(".h-room").should("contain", roomDataForUITest.roomNumber)
    cy.get(".h-floor").should("contain", `Floor #${roomDataArr[0].floor}`)
    cy.get(".h-room").should("contain", roomDataArr[0].number)
  })

  it('С184 Delete hotel', () => {
    cy.intercept("DELETE", "https://hotels-back.herokuapp.com/hotel/*").as("deleteHotel")
    cy.intercept("GET", "https://hotels-back.herokuapp.com/hotel/user/*").as("getUserData")

    cy.contains("Hotels").click()
    cy.get('.v-toolbar__title').should("contain", "Hotels").and("be.visible")

    cy.contains(hotelData.name).should("be.visible")
    cy.contains(hotelData.name).parents(".v-card").find(".v-btn__content").contains("Delete").click()
    cy.wait("@deleteHotel")
    cy.wait("@getUserData")
    cy.reload()
    cy.wait("@getUserData")
    cy.contains(hotelData.name).should("not.exist")
  })

})
