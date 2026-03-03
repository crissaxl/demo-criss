import { $ } from '@wdio/globals'
import BasePage from './BasePage';

class LoginSandboxPage extends BasePage {
    
    // Locators
    get btnGear() { return $('~choose connection button'); } 
    get btnSandboxOption() { return $('~Área restrita'); } 
    get inputUsername() { return $('~Nombre de usuario'); } 
    get inputPassword() { return $('~Contraseña'); } 
    get btnLogin() { return $('~Faça login no Sandbox'); } 
    get iconSchedule() { return $('~Schedule'); }

    // ACTION METHODS
    async selectSandboxEnvironment() {
        console.log(`### Selecting Sandbox Environment ###`);
        await this.tap(this.btnGear);
        await this.btnSandboxOption.waitForDisplayed();
        await this.tap(this.btnSandboxOption);
    }

    async loginSandbox(user: string, pass: string) {
        console.log(`### Writing User's credentials ###`);
        await this.type(this.inputUsername, user, true);
        await this.clickKeyboardOK();
        await this.type(this.inputPassword, pass, true);
        await this.clickKeyboardOK();
        await this.tap(this.btnLogin);
    }
}

export default new LoginSandboxPage();