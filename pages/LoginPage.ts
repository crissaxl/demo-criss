import { Page, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    // Constructor
    constructor(page: Page) {
        this.page = page;
    }

    // Methods
    async loginViaFrontDoor(instanceUrl: string, accessToken: string) {
        const frontDoorUrl = `${instanceUrl}/secur/frontdoor.jsp?sid=${accessToken}&retURL=/lightning/page/home`;

        await this.page.goto(frontDoorUrl);

        await this.page.waitForLoadState('load');

        await expect(this.page.getByRole('button', { name: 'App Launcher' })).toBeVisible();
    }
}