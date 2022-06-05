import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {

  if (err.message.includes('This user exists')) {
    return false
  }
})
