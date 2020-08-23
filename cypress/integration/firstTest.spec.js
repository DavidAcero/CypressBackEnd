/// <reference types="cypress" />

describe("Testing BackEnd", () => {
    
    beforeEach('Login', () => {
        cy.loginToApp()
    })

    it('Verify Request And Response', () => {
        cy.server()
        cy.route('POST', '**/articles').as('postArticle')

        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a Title')
        cy.get('[formcontrolname="description"]').type('This is a Description')
        cy.get('[formcontrolname="body"]').type('This is a Body')
        cy.contains('Publish Article').click()

        cy.wait('@postArticle')
        cy.get('@postArticle').then( xhr => {
            expect(xhr.status).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is a Body')
            expect(xhr.response.body.article.description).to.equal('This is a Description')
        })
    })
})