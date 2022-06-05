describe('Navigation tests', () => {

  let pagesData = [
    {
      pageName: "Profile",
      pageTitle: "Profile",
      pageUrl: "https://hotels-front.herokuapp.com/profile",
      caseNumber: "C200"
    },
    {
      pageName: "Change username",
      pageTitle: "Reset username",
      pageUrl: "https://hotels-front.herokuapp.com/reset-username",
      caseNumber: "C201"
    },
    {
      pageName: "Change avatar",
      pageTitle: "Reset avatar",
      pageUrl: "https://hotels-front.herokuapp.com/reset-avatar",
      caseNumber: "C202"
    },
    {
      pageName: "Change password",
      pageTitle: "Reset password",
      pageUrl: "https://hotels-front.herokuapp.com/reset-password",
      caseNumber: "C203"
    },
    {
      pageName: "Hotels",
      pageTitle: "Hotels",
      pageUrl: "https://hotels-front.herokuapp.com/hotels",
      caseNumber: "C204"
    },
    {
      pageName: "Your reservations",
      pageTitle: "Reservations",
      pageUrl: "https://hotels-front.herokuapp.com/rents",
      caseNumber: "C205"
    }
  ]

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.login()
  })

  it('C199 Review side navigation panel', () => {
    cy.get('.v-navigation-drawer > .v-list').should("contain", "Home")
      .and("contain", "User")
      .and("contain", "Hotels")
      .and("contain", "Your reservations")
      .and("contain", "Log out")
    cy.get("[role='listitem']").contains("User").click()
    cy.get(".h-expand-content").within(() => {
      cy.contains("Profile").should("be.visible")
      cy.contains("Change username").should("be.visible")
      cy.contains("Change avatar").should("be.visible")
      cy.contains("Change password").should("be.visible")
    })
    cy.get("[role='listitem']").contains("User").click()
    cy.get(".h-expand-content").should("not.be.visible")
  })

  pagesData.forEach(page => {
    it(`${page.caseNumber} Navigation to the '${page.pageName}' page`, () => {
      assertNavigation(page)
    })
  })


})

const assertNavigation = (page) => {
  cy.get("[role='listitem']").contains("User").click()
  cy.get(".v-list").within(() => {
    cy.contains(page.pageName).click()
  })

  cy.url().should("contain", page.pageUrl)
  cy.get(".v-toolbar__title").should("contain", page.pageTitle).and("be.visible")
}
