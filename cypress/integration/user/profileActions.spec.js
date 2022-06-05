import {faker} from '@faker-js/faker';
import userAccount from "../../fixtures/userData.json"

describe('User tests', () => {

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.login("changePasswordUser")
  })

  it('С188 Review initial profile', () => {
    cy.visit("https://hotels-front.herokuapp.com/profile")
    cy.get(".v-toolbar__title").should("contain", "Profile").and("be.visible")
    cy.get(".h-profile-item")
      .contains("Username:")
      .should("be.visible")
    cy.get(".h-profile-item")
      .contains("Email:")
      .siblings("h3")
      .should("contain", userAccount.userForChangePassword.email)
    cy.get(".h-profile-item")
      .contains("Account was created at:")
      .should("be.visible")
    cy.get(".h-profile-item")
      .contains("Last login from:")
      .siblings("h3")
      .should("contain", "Local")

  })

  it('С189 Change username contain all needed fields', () => {
    cy.visit("https://hotels-front.herokuapp.com/reset-username")
    cy.get('.v-toolbar__title').should("contain", "Reset username").and("be.visible")
    cy.get(".h-reset-username-container").should("contain", "Current username:")
    cy.get("[aria-label='Username']").should("be.visible")
    cy.get(".v-btn__content").contains("Change username").should("be.visible")
    cy.get(".v-btn__content").contains("Delete username").should("be.visible")
  })

  it('С190 Change username', () => {
    let userName = faker.internet.userName()
    cy.intercept("PUT", "https://hotels-back.herokuapp.com/user").as("updateUser")

    cy.visit("https://hotels-front.herokuapp.com/reset-username")
    cy.get('.v-toolbar__title').should("contain", "Reset username").and("be.visible")
    cy.get("[aria-label='Username']").type(userName)
    cy.get(".v-btn__content").contains("Change username").click()
    cy.wait("@updateUser")
    cy.get(".h-reset-username-container").should("contain", "Current username:")
      .and("contain", userName)
  })

  it('С191 Delete username', () => {
    cy.intercept("PUT", "https://hotels-back.herokuapp.com/user").as("updateUser")

    cy.visit("https://hotels-front.herokuapp.com/reset-username")
    cy.get('.v-toolbar__title').should("contain", "Reset username").and("be.visible")
    cy.get(".v-btn__content").contains("Delete username").click()
    cy.wait("@updateUser")
    cy.get(".h-reset-username-container").should("contain", "Current username:")
      .and("contain", "No username yet")
  })

  it('С192 Change avatar contain all needed fields', () => {
    cy.visit("https://hotels-front.herokuapp.com/reset-avatar")
    cy.get('.v-toolbar__title').should("contain", "Reset avatar").and("be.visible")
    cy.get("h2").contains("Upload your avatar").should("be.visible")
    cy.get(".picture-inner-text").should("contain", "Drag an image or click here to select a file")
  })

  it('С193 Change password contain all needed fields', () => {
    openResetPasswordPage()
    cy.get("[aria-label='Password']").should("be.visible")
    cy.get("[aria-label='Confirm password']").should("be.visible")
    cy.get(".v-btn__content").contains("reset").should("be.visible")
  })

  it('С194 Try to change password to existed', () => {
    cy.intercept("PUT", "https://hotels-back.herokuapp.com/user").as("updateUser")

    openResetPasswordPage()
    changePassword(userAccount.userForChangePassword.password, userAccount.userForChangePassword.password)
    cy.wait("@updateUser")
  })

  it('С195 Try to change password with not matched', () => {
    openResetPasswordPage()
    changePassword(userAccount.userForChangePassword.password, userAccount.userForChangePassword.email)
    cy.get(".v-messages__message").contains("Passwords doesn't match").should("be.visible")
  })

  it('С196 Successfully change password', () => {
    let passwordToChange = faker.internet.password()
    cy.intercept("PUT", "https://hotels-back.herokuapp.com/user").as("updateUser")

    openResetPasswordPage()
    changePassword(passwordToChange, passwordToChange)
    cy.wait("@updateUser")
    cy.get(".v-list").contains("Log out").click()

    logInWithUpdatedPassword(userAccount.userForChangePassword.email, passwordToChange)
    openResetPasswordPage()
    changePassword(userAccount.userForChangePassword.password, userAccount.userForChangePassword.password)
    cy.wait("@updateUser")
  })

})

const openResetPasswordPage = () => {
  cy.visit("https://hotels-front.herokuapp.com/reset-password")
  cy.get('.v-toolbar__title').should("contain", "Reset password").and("be.visible")
}

const logInWithUpdatedPassword = (userEmail, userPassword) => {
  cy.contains("Sign in to Hotels.com").should("be.visible")
  cy.get("input[aria-label='Email']").type(userEmail)
  cy.get("input[aria-label='Password']").type(userPassword)
  cy.get("button").contains("Sign in").click()
  cy.get('.v-navigation-drawer > .v-list').should("contain", "Home")
}

const changePassword = (password, confirmPassword) => {
  cy.get("[aria-label='Password']").type(password)
  cy.get("[aria-label='Confirm password']").type(confirmPassword)
  cy.get(".v-btn__content").contains("reset").click()
}
