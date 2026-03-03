import { expect } from '@wdio/globals';
import HomePage from '../../pageobjects/home.page';

describe('Flujos de Salesforce Móvil', () => {
    
    it('Validar que la aplicación carga y la sesión está activa', async () => {
        // Al ejecutar el test, Appium abrirá automáticamente la app de Salesforce en el iPhone 17
        
        // 1. Esperamos a que la pantalla de inicio esté lista
        await HomePage.waitForLoad();

        // 2. Aserción visual nativa: Verificamos que la barra inferior exista en la pantalla
        await expect(HomePage.bottomTabBar).toBeDisplayed();
        
        // ¡Si llega aquí, significa que la app levantó y reconoció la interfaz!
    });

});