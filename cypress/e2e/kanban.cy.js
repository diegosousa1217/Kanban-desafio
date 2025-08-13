/// <reference types="cypress" />

describe('Kanban – Fluxos principais', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('smoke: título e CTA principais aparecem', () => {
    cy.contains(/quadro kanban/i).should('be.visible');
    cy.contains(/adicionar outra lista/i).should('be.visible');
  });
  
});
