import {faker} from '@faker-js/faker';
import ApiServices from '../../support/apiService';
import {generateHotelData} from "../../support/generateHotelData";
import {generateRoomData} from "../../support/generateRoomData";

const {_} = Cypress;

describe('Booking tests', () => {
  let hotelFirstData, hotelFirstId, firstHotelRoomDataArr, hotelSecondData, hotelSecondId, secondHotelRoomDataArr;


  beforeEach(() => {
    cy.clearLocalStorage()
    ApiServices.getAccessToken()
      .then(() => {
        ApiServices.deleteHotels()
      })
    ApiServices.getAccessToken("admin")
      .then(() => {
        ApiServices.deleteHotels()

        hotelFirstData = generateHotelData()

        return ApiServices.createHotel(hotelFirstData)
      })
      .then(({body}) => {
        hotelFirstId = body.id

        firstHotelRoomDataArr = new Array(4).fill(null).map(() => generateRoomData(hotelFirstId))
        return Promise.all(firstHotelRoomDataArr.map(data => ApiServices.createRoom(data)))
      })
      .then(() => {
        hotelSecondData = generateHotelData()

        return ApiServices.createHotel(hotelSecondData)
      })
      .then(({body}) => {
        hotelSecondId = body.id

        secondHotelRoomDataArr = new Array(4).fill(null).map(() => generateRoomData(hotelSecondId))
        return Promise.all(secondHotelRoomDataArr.map(data => ApiServices.createRoom(data)))
      })

    cy.login()
  })

  it('С185 Create new booking', () => {
    cy.visit("https://hotels-front.herokuapp.com")
    // cy.get("[aria-label='Max number of places']").type(firstHotelRoomDataArr[0].numberOfPlaces)
    // cy.get('.v-select__selections').click()
    // cy.get(".v-select-list").contains(hotelFirstData.city).should("be.visible")
    cy.get("[aria-label='Room floor']").type(firstHotelRoomDataArr[0].floor)
    // cy.get("[aria-label='Max cost per day']").type(firstHotelRoomDataArr[0].cost)
    cy.contains('Hotels.com').click()
    cy.contains("Find my apartments!").click()
    console.log(hotelFirstData)
    console.log(firstHotelRoomDataArr)
    console.log(hotelSecondData)
    console.log(secondHotelRoomDataArr)

  })


})
