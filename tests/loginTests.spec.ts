import { test, expect } from '@playwright/test';
import { loginToSalesforce } from '../utils/LoginPage';

test.beforeEach(async ({ page }) => {
        test.setTimeout(600000);

        await loginToSalesforce(page);
    });

test.describe('Flujos de Salesforce', () => {
    test('Validar ingreso exitoso a Salesforce', async ({ page }) => {
        // Para este momento de la prueba, ya estás dentro de Salesforce

        // Aquí puedes agregar aserciones visuales, por ejemplo:
        await expect(page.getByRole('button', { name: 'App Launcher' })).toBeVisible();
    });

});