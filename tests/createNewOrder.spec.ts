import { test } from '@playwright/test';
import { loginToSalesforce } from '../utils/LoginPage';
import { OrderPage } from '../pages/OrderPage';

test.describe('Flujos de Salesforce: Órdenes', () => {

    test.beforeEach(async ({ page }) => {
        test.setTimeout(600000);
        await loginToSalesforce(page);
    });

    test('Crear una orden exitosamente para un cliente parametrizado', async ({ page }) => {
        const orderPage = new OrderPage(page);
        
        // --- Parámetros de la prueba ---
        const appName = 'Sushilindro Operations';
        const cliente = 'Cristian Axel Martínez';
        const productos = ['Arrachindro', 'Sprite'];
        const fechaInicio = '03/03/2026'; 

        await test.step(`Navegar a la aplicación ${appName}`, async () => {
            await orderPage.navigateToApp(appName);
        });

        await test.step(`Buscar cuenta del cliente: ${cliente}`, async () => {
            await orderPage.searchAndSelectAccount(cliente);
        });

        await test.step(`Iniciar nueva orden con fecha ${fechaInicio}`, async () => {
            await orderPage.createNewOrder(fechaInicio);
        });

        await test.step(`Agregar productos: ${productos.join(', ')}`, async () => {
            await orderPage.addProducts(productos);
        });

        await test.step('Configurar cantidades y características', async () => {
            await orderPage.editOrderLines();
        });

        await test.step('Verificar mensaje de éxito', async () => {
            await orderPage.verifyOrderSuccess();
        });
    });

});