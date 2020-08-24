
describe('Test Log Out', () => {

    beforeEach('Login to the App', () => {
        cy.loginToApp()
    })

    it('Verify User Can Log Out', () => {
        cy.contains('Settings').click()
        cy.contains('Or click here to logout').click()
        cy.get('.navbar-nav').should('contain', 'Sign up')
    })
})