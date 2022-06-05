import { faker } from '@faker-js/faker';

describe('Registration tests', () => {

  let userData = {
    email: faker.internet.email(),
    password: faker.internet.password()
  }

  it('С197 Register new user', () => {
    cy.intercept("POST", "https://hotels-back.herokuapp.com/user/signUp").as("signUpRequest")

    cy.visit("https://hotels-front.herokuapp.com/sign-up")
    cy.get('.v-toolbar__title').should("contain", "Sign up").and("be.visible")
    cy.get("input[aria-label='Email']").type(userData.email)
    cy.get("input[aria-label='Password']").type(userData.password)
    cy.get("button").contains("Sign up").click()
    cy.wait("@signUpRequest").then(({response}) => {
      expect(response.statusCode).to.be.eq(200)
    })
  })

  it('С198 Register user with existed email', () => {
    cy.intercept("POST", "https://hotels-back.herokuapp.com/user/signUp").as("signUpRequest")

    cy.visit("https://hotels-front.herokuapp.com/sign-up")
    cy.get('.v-toolbar__title').should("contain", "Sign up").and("be.visible")
    cy.get("input[aria-label='Email']").type(userData.email)
    cy.get("input[aria-label='Password']").type(userData.password)
    cy.get("button").contains("Sign up").click()
    cy.wait("@signUpRequest").then(({response}) => {
      expect(response.statusCode).to.be.eq(400)
      cy.contains("This user exists").should("exist")
    })
  })

})
