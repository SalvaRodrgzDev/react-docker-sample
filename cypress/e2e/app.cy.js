describe('App', () => {
  it('loads and increments counter', () => {
    cy.visit('/')
    cy.contains('Vite + React').should('be.visible')
    cy.contains('count is').click()
  })
})
