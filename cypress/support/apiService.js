import userAccounts from "../fixtures/userData.json"
const {_} = Cypress;

let token;

class ApiService {

  static getAccessToken(specifiedUser) {
    let userForLogin = (specifiedUser === "admin")
      ? userAccounts.adminUserData
      : userAccounts.userData;


    return cy.request({
      method: "POST",
      url: `https://hotels-back.herokuapp.com/user/signIn`,
      body: {
        "email": userForLogin.email,
        "password": userForLogin.password
      }
    }).then(response => {
      token = response.headers.authorization
    })
  }

  static deleteHotels() {
    cy.request({
      method: "GET",
      url: "https://hotels-back.herokuapp.com/hotel/user/29",
      headers: {
        Authorization: token,
      }
    })
      .then(({body}) => {
        _.forEach(body, item => {
          cy.request({
            method: "DELETE",
            url: `https://hotels-back.herokuapp.com/hotel/${item.id}`,
            headers: {
              Authorization: token,
            }
          })
        })
      })

  }

  static createHotel(hotelData) {
    return cy.request({
      method: "POST",
      url: "https://hotels-back.herokuapp.com/hotel",
      body: hotelData,
      headers: {
        Authorization: token,
      }
    })
  }

  static createRoom(roomData) {
    return fetch("https://hotels-back.herokuapp.com/room", {
      method: "POST",
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(roomData)
    })
      .then(res => res.json())
  }
}

export default ApiService;
