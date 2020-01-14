describe('The Home Page', () => {
  it('successfully loads the page', () => {
    cy.visit('/');
    cy.get('header.App-header').should('contain', 'WELCOME TO NOTHING 🤗');
    expect(true).to.equal(true);
  });
});
