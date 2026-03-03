import { $, browser } from '@wdio/globals';

class LoginPage {
    get usernameInput() { 
        return $('-ios predicate string:name == "Nombre de usuario" AND label == "Nombre de usuario" AND type == "XCUIElementTypeTextField"'); 
    }
    
    get passwordInput() { 
        return $('-ios predicate string:name == "Contraseña" AND type == "XCUIElementTypeSecureTextField"'); 
    }
    
    get loginBtn() { return $('//XCUIElementTypeButton[@name="Iniciar sesión"]'); }
    
    // --- NUEVO SELECTOR PARA EL BOTÓN ALLOW ---
    // Respetamos los espacios exactos " Allow " usando Predicate String
    get allowBtn() { 
        return $('-ios predicate string:name == " Allow " AND type == "XCUIElementTypeButton"'); 
    } 

    async swipeToAllow() {
        await browser.action('pointer')
            .move({ x: 348, y: 695 })
            .down()
            .move({ x: 348, y: 422, duration: 750 })
            .up()
            .perform();
    }
}

export default new LoginPage();