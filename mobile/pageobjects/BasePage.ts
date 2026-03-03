import { browser } from '@wdio/globals';

export default class BasePage {

    // Locators
    get btnKeyboardOK() { return $('//XCUIElementTypeButton[@name="OK"]'); }
    get btnPermitir() { return $('~Permitir'); }
    get btnBack() { return $('~BackButton'); }
    get actionHeader() { return $('~ActionBarHeaderView.headerTitleLabel'); }
    get statusSyncComplete() { return $(`-ios predicate string:type == 'XCUIElementTypeButton' AND name == 'AlertBarView.alertBarLabel' AND label CONTAINS 'FINALIZADA'`); }

    // GENERAL METHODS
    async tap(element: ChainablePromiseElement) {
        await element.waitForDisplayed({ timeout: 10000 });
        await element.click();
    }

    /**
     * @param element - The element (input/field) to type into.
     * @param text - The text to be entered.
     * @param skipHideKeyboard - (Optional) Controls whether the keyboard is dismissed after completion.
     * - `false` (Default): Attempts to automatically dismiss the keyboard (via tapOutside or Enter).
     * - `true`: Keeps the keyboard open (Useful for tapping keyboard keys like 'Search' or 'Go').
     */
    async type(element: ChainablePromiseElement, text: string, skipHideKeyboard: boolean = false) {
        await element.waitForDisplayed({ timeout: 10000 });
        await element.clearValue(); 
        await element.setValue(text);
        
        if (!skipHideKeyboard && await driver.isKeyboardShown()) {
            try { 
                await driver.hideKeyboard('tapOutside'); 
            } catch (e) {
                console.log('### hideKeyboard failed, trying Enter key ###');
                try {
                    await browser.keys(['Enter']);
                } catch (e2) {}
            } 
        }
    }

    // SYSTEM METHODS
    async clickKeyboardOK() {
        if (await driver.isKeyboardShown()) {
            try {
                if (await this.btnKeyboardOK.isDisplayed()) {
                    await this.btnKeyboardOK.click();
                }
            } catch (error) {
                console.log('### OK button not found, pressing Enter key ###');
                await browser.keys(['Enter']);
            }
        }
    }

    async handlePrivacyPrompt() {
        await driver.pause(2000); 
        console.log('### Searching for Privacy Prompt ###');
        const maxScrolls = 5;
        
        for (let i = 0; i < maxScrolls; i++) {
            if (await this.btnPermitir.isDisplayed()) {
                console.log('### Button "Permitir" found ###');
                break; 
            }

            console.log(`### Button not visible. Making Scroll ${i + 1}/${maxScrolls}... ###`);
 
            await this.swipeUpToScroll(); 
        }
        await this.btnPermitir.waitForDisplayed({ timeout: 5000 });
        console.log('### Clicking button "Permitir" ###');
        await this.btnPermitir.click();
    }

    async enterIphonePasscode() {
        console.log('### iPhone Passcode Screen Detected ###');
        await driver.pause(2000); 
        
        const retryBtn = await $('~Retry Unlock');     
        
        const tryToUnlock = async () => {
            if (await retryBtn.isDisplayed()) {
                console.log('### Cancel Screen Detected. Retrying... ###');
                await retryBtn.click();
                await driver.pause(1500); 
            }

            console.log('### Sending Passcode "1" + Return ###');
            await browser.keys(['1']); 
            await driver.pause(500); 
            await browser.keys(['\uE006']); 
        };

        await driver.pause(2000);
        await tryToUnlock();
        
        console.log('### Passcode entered. Waiting for App Home... ###');
    }

    // GENERAL APP METHODS
    async waitForSyncComplete() {
        console.log('### Waiting for Data Synchronization to Finish... ###');
        try {
            await this.statusSyncComplete.waitForDisplayed({ 
                timeout: 45000, 
                timeoutMsg: '### Error: Sync failed after 45 seconds ###'
            });
            console.log('### Synchronization Finished (Green Bar Detected) ###');
            await this.statusSyncComplete.waitForDisplayed({ reverse: true, timeout: 8000 });
        } catch (error) {
            console.warn('### Warning: Sync bar not detected or timed out ###');
        }
    }

    /**
     * @param tabName - Exact item name (ej: 'Schedule', 'Inventory', 'Perfil')
     */
    async selectBottomTab(tabName: string) {
        console.log(`### Selecting: "${tabName}" ###`);
        const tabSelector = $(`//XCUIElementTypeButton[@name="NavRail.view" and @label="${tabName}"]`);
        await this.tap(tabSelector);
    }

    async selectTopTab(tabName: string) {
        console.log(`### Selecting: "${tabName}" ###`);
        const tab = $(`~${tabName}`);
        await this.tap(tab);
    }

    async openActionBar() {
        console.log('### Opening Action Bar Header ###');
        await this.tap(this.actionHeader);
    }

    async selectAction(actionLabel: string) {
        console.log(`### Selecting Action: "${actionLabel}" ###`);
        
        const selector = `-ios predicate string:type == 'XCUIElementTypeStaticText' AND value == '${actionLabel}'`;
        const actionBtn = $(selector);
        let maxScrolls = 5;

        while (maxScrolls > 0) {
            if (await actionBtn.isDisplayed()) {
                console.log(`### Action "${actionLabel}" found. Clicking ###`);
                await this.tap(actionBtn);
                return;
            }

            console.log(`### Action "${actionLabel}" not visible yet. Scrolling down... (${maxScrolls} retries left) ###`);
            await this.swipeUpToScroll(); 
            maxScrolls--;
        }

        throw new Error(`### ERROR Action "${actionLabel}" not found ###`);
    }

    /**
     * Scans the whole screen to find and extract values for multiple fields as it appears
     * @param labelsToFind Array with the exact field labels to look for (Ej: ["Início real", "Status", "Duração"])
     */
    async getMultipleFieldValues(labelsToFind: string[]): Promise<{ [key: string]: string }> {
        console.log(`### Starting batch extraction for: ${labelsToFind.join(', ')} ###`);
        const results: { [key: string]: string } = {};
        let pendingLabels = [...labelsToFind]; 
        const maxScrolls = 8;

        for (let i = 0; i <= maxScrolls; i++) {
            for (const labelName of [...pendingLabels]) {
                const labelElement = $(`//XCUIElementTypeStaticText[@name="${labelName}"]`);
                if (await labelElement.isDisplayed()) {
                    const { height } = await driver.getWindowRect();
                    const location = await labelElement.getLocation();
                    
                    if (location.y > (height * 0.80)) {
                        console.log(`### Label "${labelName}" is too low (Y:${location.y}). Scrolling a litle bit...`);
                        await this.swipeSmall();
                    }

                    const valueElement = $(`//XCUIElementTypeStaticText[@name="${labelName}"]/following-sibling::XCUIElementTypeStaticText[1]`);
                    await valueElement.waitForDisplayed({ timeout: 5000 });
                    const text = await valueElement.getText();
                    results[labelName] = text;
                    console.log(`### Extracted [${labelName}]: "${text}" ###`);
                    pendingLabels = pendingLabels.filter(l => l !== labelName);
                }
            }

            if (pendingLabels.length === 0) {
                break;
            }

            if (i < maxScrolls) {
                console.log(`### Still missing: [${pendingLabels.join(', ')}]. Scrolling down... ###`);
                await this.swipeUpToScroll();
            }
        }

        if (pendingLabels.length > 0) {
            throw new Error(`### ❌ Assert Failed: Could not find values for fields: ${pendingLabels.join(', ')} ###`);
        }

        return results;
    }

    async getFieldValue(labelName: string) {
        const labelElement = $(`//XCUIElementTypeStaticText[@name="${labelName}"]`);
        const maxScrolls = 5;
        let isFound = false;

        for (let i = 0; i < maxScrolls; i++) {
            if (await labelElement.isDisplayed()) {
                isFound = true;
                break;
            }
            
            console.log(`### Field "${labelName}" not visible. Scrolling down (${i + 1}/${maxScrolls}) ###`);
            await this.swipeUpToScroll();
        }

        if (!isFound) {
            throw new Error(`### Element "${labelName}" not found after ${maxScrolls} scrolls. ###`);
        }

        const { height } = await driver.getWindowRect();
        const location = await labelElement.getLocation();

        if (location.y > (height * 0.80)) {
            console.log(`### Label "${labelName}" is too low (Y:${location.y}). Scrolling a litle bit...`);
            await this.swipeSmall();
        }

        const valueElement = $(`//XCUIElementTypeStaticText[@name="${labelName}"]/following-sibling::XCUIElementTypeStaticText[1]`);
        await valueElement.waitForDisplayed({ timeout: 5000 });
        const text = await valueElement.getText();
        console.log(`### Value for [${labelName}] is: "${text}" ###`);
        return text;
    }

    async swipeSmall() {
        const { width, height } = await driver.getWindowRect();
        const centerX = Math.round(width / 2);
        const startY = Math.round(height * 0.60);
        const endY = Math.round(height * 0.50);

        await driver.performActions([
            {
                type: 'pointer',
                id: 'fingerNudge',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: centerX, y: startY },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerMove', duration: 400, origin: 'viewport', x: centerX, y: endY },
                    { type: 'pointerUp', button: 0 }
                ]
            }
        ]);
        
        await driver.releaseActions();
        await driver.pause(500); 
    }

    async swipeUpToScroll() {
        const { width, height } = await driver.getWindowRect();
        const centerX = Math.round(width / 2);
        const startY = Math.round(height * 0.75);
        const endY = Math.round(height * 0.35);

        await driver.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: centerX, y: startY },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerMove', duration: 750, origin: 'viewport', x: centerX, y: endY },
                    { type: 'pointerUp', button: 0 }
                ]
            }
        ]);
        await driver.releaseActions();
        await driver.pause(500); 
    }

    async pullToRefresh() {
        console.log('### Executing Pull-to-Refresh ###');
        const { width, height } = await driver.getWindowRect();
        const centerX = Math.round(width / 2);
        const startY = Math.round(height * 0.25); 
        
        const endY = Math.round(height * 0.85);

        console.log(`### Swiping from Center (${centerX}, ${startY}) to Bottom (${centerX}, ${endY}) ###`);

        await driver.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: centerX, y: startY },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerMove', duration: 850, origin: 'viewport', x: centerX, y: endY },
                    { type: 'pause', duration: 500 },
                    { type: 'pointerUp', button: 0 }
                ]
            }
        ]);

        await driver.releaseActions();
        console.log('### Waiting for data sync... ###');
        await driver.pause(2000);
    }

    async navigateBack() {
        console.log('### Navigating Back ###');
        await this.tap(this.btnBack);
    }

    /**
     * @param textToFind Text contained in the element to be clicked. (Ej Work Order number like "00000681")
     */
    async clickItemByText(textToFind: string) {
        console.log(`### Searching element with text: "${textToFind}" ###`);
        const item = $(`-ios predicate string:type == 'XCUIElementTypeStaticText' AND value CONTAINS '${textToFind}'`);
        const maxScrolls = 5;
        let isFound = false;

        for (let i = 0; i < maxScrolls; i++) {
            if (await item.isDisplayed()) {
                isFound = true;
                console.log(`### Item "${textToFind}" found on screen ###`);
                break; 
            }

            console.log(`### Item not visible. Scrolling down (${i + 1}/${maxScrolls})... ###`);
            await this.swipeUpToScroll();
        }
        if (!isFound) {
            throw new Error(`### Error:Item with text "${textToFind}" was not found after ${maxScrolls} scrolls. ###`);
        }

        await item.waitForDisplayed({ timeout: 5000 });
        console.log(`### Clicking item with text: "${textToFind}" ###`);
        await item.click();
    }
}