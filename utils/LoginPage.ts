import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getSalesforceToken } from './PruebaJWT'; // Tu código original

export async function loginToSalesforce(page: Page) {
    const loginPage = new LoginPage(page);

    const authData = await getSalesforceToken();

    await loginPage.loginViaFrontDoor(authData.instanceUrl, authData.accessToken);
} 