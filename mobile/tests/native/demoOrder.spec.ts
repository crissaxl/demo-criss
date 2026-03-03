import { browser } from '@wdio/globals';
import LoginPage from '../../pageobjects/login.page';
import OrderPage from '../../pageobjects/order.page';

describe('Demo Salesforce Mobile - Flujo Completo E2E', () => {
    
    it('Debe iniciar sesión y completar el flujo de la orden', async () => {
        // ==========================================
        // FASE 1: INICIO DE SESIÓN
        // ==========================================
        await browser.pause(3000); // Pausa para iniciar la grabación

        await LoginPage.usernameInput.waitForDisplayed({ timeout: 15000 });
        
        // --- EL TRUCO PARA iOS ---
        // Hacemos un clic primero para asegurar que el campo tiene el foco y el teclado se levanta
        await LoginPage.usernameInput.click();
        await browser.pause(500); 
        
        // Ahora sí, escribimos
        await LoginPage.usernameInput.setValue('sushilindro@salesforce.com');
        await browser.pause(1000);

        await LoginPage.passwordInput.click(); // Opcional, pero recomendado
        await browser.pause(500);
        await LoginPage.passwordInput.setValue('ZlF946rZL8b');
        await browser.pause(1000);

        await LoginPage.loginBtn.click();
        
        // Esperamos a que pase la validación y empiece a cargar la pantalla de permisos
        await browser.pause(2500); 

        // Deslizamos la pantalla (Scroll) y damos click en Permitir
        await LoginPage.swipeToAllow();
        await browser.pause(1500); // Pausa visual para la animación del scroll
        
        // Aseguramos que el botón ya es visible después del scroll antes de clickear
        await LoginPage.allowBtn.waitForDisplayed({ timeout: 10000 });
        await LoginPage.allowBtn.click();
        
        // ==========================================
        // FASE 2: NAVEGACIÓN A LA ORDEN
        // ==========================================
        // Esperamos a que cargue el inicio (Dashboard) de Salesforce
        await OrderPage.accountRecord.waitForDisplayed({ timeout: 20000 });
        await OrderPage.accountRecord.click();
        await browser.pause(2000);

        await OrderPage.relatedTab.click();
        await browser.pause(2000);

        await OrderPage.ordersSection.click();
        await browser.pause(2000);

        // --- EL NUEVO CLIC DE LA ORDEN ---
        // Esperamos a que la lista cargue y encuentre tu XPath anidado
        await OrderPage.specificOrderLink.waitForDisplayed({ timeout: 10000 });
        await browser.pause(1000); // Pausa visual para la demo
        await OrderPage.specificOrderLink.click();
        await browser.pause(4000); // Pausa larga para que cargue la orden

        // ==========================================
        // FASE 3: CAMBIO DE ESTADO (PATH)
        // ==========================================
        await OrderPage.inQueuePath.click();
        await browser.pause(1500);

        // Clickear 4 veces para completar la ruta
        for (let i = 0; i < 4; i++) {
            await OrderPage.markCompleteBtn.click();
            await browser.pause(2500); // Pausa para apreciar la animación
        }

        // Fin de la demo
        await browser.pause(3000);
    });

});