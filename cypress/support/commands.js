// Utilidades reutilizáveis para manter os testes limpos e legíveis

Cypress.Commands.add('addList', (title) => {
  cy.contains(/adicionar outra lista/i).click();
  cy.get('input, textarea')
    .filter(':visible')
    .first()
    .clear()
    .type(`${title}{enter}`);
  cy.contains(new RegExp(`^${Cypress._.escapeRegExp(title)}$`)).should('be.visible');
});

Cypress.Commands.add('findList', (title) => {
  // Retorna o container/coluna da lista pelo título visível
  return cy.contains(new RegExp(`^${Cypress._.escapeRegExp(title)}$`))
    .parentsUntil('body')
    .parent();
});

Cypress.Commands.add('addCardToList', (listTitle, cardTitle) => {
  cy.findList(listTitle).within(() => {
    // variações de texto para o botão de adicionar card
    cy.contains(/adicionar cartão|\+ adicionar cartão|novo cartão/i).click({ force: true });
  });
  cy.get('input, textarea').filter(':visible').first().type(`${cardTitle}{enter}`);
  cy.findList(listTitle).contains(cardTitle).should('be.visible');
});

Cypress.Commands.add('editCard', (oldTitle, newTitle) => {
  cy.contains(oldTitle).click({ force: true });
  cy.get('input, textarea').filter(':visible').first().clear().type(`${newTitle}{enter}`);
  cy.contains(newTitle).should('be.visible');
});

Cypress.Commands.add('deleteCard', (title) => {
  // Procura o cartão e tenta excluir pelo menu/ação com textos comuns
  cy.contains(title).parentsUntil('body').parent().within(() => {
    cy.contains(/excluir|remover|apagar/i).click({ force: true });
  });
  // Se houver modal de confirmação
  cy.get('body').then($b => {
    if ($b.text().match(/confirmar|sim|ok/i)) {
      cy.contains(/confirmar|sim|ok/i).click({ force: true });
    }
  });
  cy.contains(title).should('not.exist');
});

Cypress.Commands.add('dragCardToList', (cardTitle, targetListTitle) => {
  const draggable = () => cy.contains(cardTitle).first();
  const dropTarget = () => cy.findList(targetListTitle);

  // Fallback simples com pointer events; pode ser necessário ajustar conforme a implementação do DnD
  draggable().trigger('pointerdown', { which: 1, force: true });
  dropTarget().trigger('pointermove', { force: true }).trigger('pointerup', { force: true });

  dropTarget().contains(cardTitle).should('exist');
});
