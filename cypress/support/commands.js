import userAccounts from "../fixtures/userData.json"

Cypress.Commands.add('login', (specifiedUser) => {
  let userForLogin;

  switch (specifiedUser) {
    case "admin": {
      userForLogin = userAccounts.adminUserData
      break;
    }
    case "changePasswordUser": {
      userForLogin = userAccounts.userForChangePassword
      break;
    }
    default : {
      userForLogin = userAccounts.userData
      break;
    }
  }
  cy.intercept("POST", "https://hotels-back.herokuapp.com/user/signIn").as("signInRequest")

  cy.visit("https://hotels-front.herokuapp.com/sign-in")
  cy.get('.v-toolbar__title').should("contain", "Sign in").and("be.visible")
  cy.get("input[aria-label='Email']").type(userForLogin.email)
  cy.get("input[aria-label='Password']").type(userForLogin.password)
  cy.get("button").contains("Sign in").click()
  cy.wait("@signInRequest")
})
