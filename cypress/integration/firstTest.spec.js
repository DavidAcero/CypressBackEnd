/// <reference types="cypress" />

describe("Testing BackEnd", () => {
    
    beforeEach('Login', () => {
        cy.server()
        cy.route('GET', '**/tags', 'fixture:tags.json')
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

    it('Should Gave Tags with Routing(Mock) Object', () => {
        cy.get('.tag-list')
        .should('contain', 'Cypress')
        .and('contain', 'Automation')
        .and('contain', 'Testing')
    })

    it('Verify Global Feed Likes Count', () => {
        cy.route('GET', '**/articles/feed*', '{"articles":[],"articlesCount":0}')
        cy.route('GET', '**/articles*', 'fixture:articles.json')

        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then(listofButtons => {
            expect(listofButtons[0]).to.contain('1')
            expect(listofButtons[1]).to.contain('5')
        })

        cy.fixture('articles').then( file => {
            const articleLink = file.articles[1].slug
            cy.route('POST', '**/articles/' + articleLink +'/favorite', file)
        })

        cy.get('app-article-list button').eq(1).click()
            .should('contain', '6')
    })

    it('Delete a new article in global Feed', () => {

        const bodyRequest = {
            "article": {
                "tagList": [],
                "title": "I love Cypress",
                "description": "Testing Cypress",
                "body": "Are we humans? Or are we dancers?"
            }
        }

       cy.get('@TestToken').then( token => {

                cy.request({
                    url: Cypress.env('apiUrl') + 'api/articles/',
                    headers: {'Authorization' : 'Token ' + token},
                    method: 'POST',
                    body: bodyRequest
                }).then( response => {
                    expect(response.status).to.equal(200)
                })

                cy.contains('Global Feed').click()
                cy.get('.article-preview').first().click()
                cy.get('.article-actions').contains('Delete Article').click()

                cy.request({
                    url: Cypress.env('apiUrl') + 'api/articles?limit=10&offset=0',
                    headers: {'Authorization' : 'Token ' + token},
                    method: 'GET',
                }).its('body').then(body => {
                    expect(body.articles[0].title).not.to.equal('I love Cypress')
                })

            })

        
    })
})