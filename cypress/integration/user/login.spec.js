import userAccount from "../../fixtures/userData.json"

describe('Registration tests', () => {

  it('С186 Login with valid creds', () => {

    cy.visit("https://hotels-front.herokuapp.com/sign-in")
    cy.get('.v-toolbar__title').should("contain", "Sign in").and("be.visible")
    cy.get("input[aria-label='Email']").type(userAccount.userData.email)
    cy.get("input[aria-label='Password']").type(userAccount.userData.password)
    cy.get("button").contains("Sign in").click()
    cy.get('.v-navigation-drawer > .v-list').should("contain", "Home")
      .and("contain", "User")
      .and("contain", "Hotels")
      .and("contain", "Your reservations")
      .and("contain", "Log out")
  })

  it('С187 Try to login with wrong creds', () => {
    cy.intercept("POST", "https://hotels-back.herokuapp.com/user/signIn").as("signInRequest")

    cy.visit("https://hotels-front.herokuapp.com/sign-in")
    cy.get('.v-toolbar__title').should("contain", "Sign in").and("be.visible")
    cy.get("input[aria-label='Email']").type(userAccount.userData.email)
    cy.get("input[aria-label='Password']").type("wrongPass")
    cy.get("button").contains("Sign in").click()
    cy.wait("@signInRequest").then(({response}) => {
      expect(response.statusCode).to.be.eq(401)
      cy.contains("Invalid credentials").should("exist")
    })
    cy.get('.v-navigation-drawer > .v-list').should("contain", "Home")
      .and("contain", "Sign in")
      .and("contain", "Sign up")
    cy.get('.v-navigation-drawer > .v-list').should("not.contain", "User")
      .and("not.contain", "Hotels")
      .and("not.contain", "Your reservations")
      .and("not.contain", "Log out")
  })

})
