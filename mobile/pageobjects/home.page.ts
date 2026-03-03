import { $ } from '@wdio/globals';

export class HomePage {
    /**
     * Definimos los selectores nativos.
     * El símbolo '~' en WebdriverIO le indica a Appium que busque por "Accessibility ID"
     */
    get bottomTabBar() {
        // Selector común para la barra de navegación principal en iOS
        return $('~Tab Bar'); 
    }

    get profileIcon() {
        // Otro selector clásico si quisieras interactuar con el perfil
        return $('~Profile'); 
    }

    /**
     * Métodos de acción
     */
    async waitForLoad() {
        // Esperamos hasta 15 segundos a que la interfaz nativa reaccione y sea visible
        await this.bottomTabBar.waitForDisplayed({ timeout: 15000 });
    }
}

export default new HomePage();