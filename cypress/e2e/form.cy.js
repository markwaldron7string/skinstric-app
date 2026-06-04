describe('Skinstric intake form', () => {
  it('advances from the name step to the city step', () => {
    cy.visit('/form')

    // Type a name into the first input and press Enter to submit.
    // {enter} fires a real keypress, the same way a user would.
    cy.get('input[placeholder="Introduce Yourself"]').type('Mark{enter}')

    // After submitting, the city step's input should appear on screen.
    cy.get('input[placeholder="your city name"]').should('be.visible')
  })
  it('shows an error and stays on the name step for invalid input', () => {
    cy.visit('/form')

    // Type a name with digits — invalid — and submit.
    cy.get('input[placeholder="Introduce Yourself"]').type('Mark123{enter}')

    // The error message should appear...
    cy.contains('Only letters allowed').should('be.visible')

    // ...and we should NOT have advanced — the city input must not exist.
    cy.get('input[placeholder="your city name"]').should('not.exist')
  })
  it('completes the full flow: name, city, then success', () => {
    // Intercept the analysis API call BEFORE it happens, and respond with
    // a fake success. The app proceeds as if the real API answered.
    // We give the intercept an alias (@phaseOne) so we can wait for it.
    cy.intercept('POST', '**/skinstricPhaseOne', {
      statusCode: 200,
      body: { success: true },
    }).as('phaseOne')

    cy.visit('/form')

    // Step 1 — name
    cy.get('input[placeholder="Introduce Yourself"]').type('Mark{enter}')

    // Step 2 — city (this submission triggers the intercepted fetch)
    cy.get('input[placeholder="your city name"]').type('Denver{enter}')

    // Wait for the intercepted call to actually fire — proves the app
    // reached the API step with our fake response.
    cy.wait('@phaseOne')

    // Step 3 — the success state. The form shows "Thank you!" then a
    // "Proceed" affordance after a short delay.
    cy.contains('Thank you!').should('be.visible')
  })
})