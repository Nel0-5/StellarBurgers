const BASE_URL = 'https://norma.nomoreparties.space/api';

const INGREDIENT_IDS = {
  BUN1: '643d69a5c3f7b9001cfa093c',
  BUN2: '643d69a5c3f7b9001cfa093d',
  MAIN1: "643d69a5c3f7b9001cfa0940",
  MAIN2: "643d69a5c3f7b9001cfa093e",
  SAUCE1: '643d69a5c3f7b9001cfa0942',
  SAUCE2: "643d69a5c3f7b9001cfa0943"
} as const;

const SELECTORS = {
  INGREDIENT: (id: string) => `[data-cy="${id}"]`,
  CONSTRUCTOR_ELEMENT: (id: string, position: string) => 
    `[data-cy="constructor-element-${position}${id}"]`,
  ORDER_BUTTON: '[data-cy="order-button"]',
  OVERLAY: '[data-cy="overlay"]',
  MODAL: '#modals',
  COUNTER: '.counter__num'
};

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.fixture('ingredients.json').then(ingredients => {
      cy.intercept('GET', `${BASE_URL}/ingredients`, { body: ingredients });
    });
    cy.fixture('user.json').then(user => {
      cy.intercept('POST', `${BASE_URL}/auth/login`, { body: user });
      cy.intercept('GET', `${BASE_URL}/auth/user`, { body: user });
    });
    cy.fixture('order.json').then(order => {
      cy.intercept('POST', `${BASE_URL}/orders`, { body: order });
    });

    cy.visit('/');
    cy.viewport(1440, 800);
    cy.get(SELECTORS.MODAL).as('modal');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    describe('Счетчики ингредиентов', () => {
      it('должен увеличивать счетчик булки до 2 и не увеличивать дальше', () => {
        cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BUN1)).within(() => {
          cy.get('button').click();
          cy.get(SELECTORS.COUNTER).should('contain', '2');
          cy.get('button').click();
          cy.get(SELECTORS.COUNTER).should('contain', '2');
        });
      });

      it('должен увеличивать счетчик начинки при каждом добавлении', () => {
        cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.MAIN1)).within(() => {
          cy.get('button').click();
          cy.get(SELECTORS.COUNTER).should('contain', '1');
          cy.get('button').click();
          cy.get(SELECTORS.COUNTER).should('contain', '2');
        });
      });

      it('должен увеличивать счетчик соуса при каждом добавлении', () => {
        cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.SAUCE1)).within(() => {
          cy.get('button').click();
          cy.get(SELECTORS.COUNTER).should('contain', '1');
          cy.get('button').click();
          cy.get(SELECTORS.COUNTER).should('contain', '2');
        });
      });
    });

    describe('Добавление в конструктор', () => {
      it('должен добавлять булку в пустой конструктор', () => {
        cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BUN1)).children('button').click();
        cy.get(SELECTORS.CONSTRUCTOR_ELEMENT(INGREDIENT_IDS.BUN1, 'top'))
          .should('contain', 'Краторная булка N-200i');
        cy.get(SELECTORS.CONSTRUCTOR_ELEMENT(INGREDIENT_IDS.BUN1, 'bot'))
          .should('contain', 'Краторная булка N-200i');
      });

      it('должен добавлять начинку в пустой конструктор', () => {
        cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.MAIN1)).children('button').click();
        cy.get(SELECTORS.CONSTRUCTOR_ELEMENT(INGREDIENT_IDS.MAIN1, ''))
          .should('contain', 'Говяжий метеорит (отбивная)');
      });

      it('должен заменять булку при добавлении новой', () => {
        cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BUN1)).children('button').click();
        cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BUN2)).children('button').click();
        cy.get(SELECTORS.CONSTRUCTOR_ELEMENT(INGREDIENT_IDS.BUN2, 'top'))
          .should('contain', 'Флюоресцентная булка R2-D3');
        cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BUN1))
          .find(SELECTORS.COUNTER).should('not.exist');
      });

      it('должен добавлять несколько начинок в конструктор', () => {
        cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.MAIN1)).children('button').click();
        cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.MAIN2)).children('button').click();
        
        cy.get(SELECTORS.CONSTRUCTOR_ELEMENT(INGREDIENT_IDS.MAIN1, ''))
          .should('contain', 'Говяжий метеорит (отбивная)');
        cy.get(SELECTORS.CONSTRUCTOR_ELEMENT(INGREDIENT_IDS.MAIN2, ''))
          .should('contain', 'Филе Люминесцентного тетраодонтимформа');
      });
    });
  });

  describe('Оформление заказа', () => {
    beforeEach(() => {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
      cy.setCookie('accessToken', 'test-access-token');
    });

    afterEach(() => {
      window.localStorage.clear();
      cy.clearAllCookies();
    });

    it('должен оформлять заказ и показывать номер заказа', () => {
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BUN1)).children('button').click();
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.MAIN1)).children('button').click();
      cy.get(SELECTORS.ORDER_BUTTON).click();
      cy.get('@modal').within(() => {
        cy.contains('идентификатор заказа').should('exist');
        cy.get('h2').should('contain', '78782');
      });
    });
  });

  describe('Модальные окна', () => {
    it('должен открывать модальное окно с деталями ингредиента', () => {
      cy.get('@modal').should('be.empty');
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BUN1)).children('a').click();
      cy.get('@modal').within(() => {
        cy.contains('Детали ингредиента').should('exist');
        cy.contains('Краторная булка N-200i').should('exist');
      });
      cy.url().should('include', INGREDIENT_IDS.BUN1);
    });

    it('должен закрывать модальное окно по клику на кнопку закрытия', () => {
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BUN1)).children('a').click();
      cy.get('@modal').should('be.not.empty');
      cy.get('@modal').find('button').first().click();
      cy.get('@modal').should('be.empty');
    });

  it('закрытие модального окна ингредиента по клику на оверлей', () => {
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BUN1)).children('a').click();
      cy.get('@modal').should('be.not.empty');
      cy.get(SELECTORS.OVERLAY).click({ force: true });
      cy.get('@modal').should('be.empty');
    });

    it('должен закрывать модальное окно по нажатию Escape', () => {
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BUN1)).children('a').click();
      cy.get('@modal').should('be.not.empty');
      cy.get('body').type('{esc}');
      cy.get('@modal').should('be.empty');
    });
  });
});