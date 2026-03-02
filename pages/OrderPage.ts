import { Page, expect } from '@playwright/test';

export class OrderPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToApp(appName: string) {
        await this.page.getByRole('button', { name: 'App Launcher' }).click();
        const searchBox = this.page.getByRole('combobox', { name: 'Search apps and items...' });
        await searchBox.fill(appName);
        await this.page.getByRole('option', { name: appName }).click();
    }

    async searchAndSelectAccount(accountName: string) {
        // Aseguramos que estamos en la vista "All Accounts"
        await this.page.getByRole('button', { name: /Select a List View/i }).click();
        await this.page.getByRole('option', { name: 'All Accounts' }).click();

        // Buscamos la cuenta específica
        const searchBox = this.page.getByRole('searchbox', { name: 'Search this list...' });
        await searchBox.click();
        await searchBox.fill(accountName);
        await searchBox.press('Enter');

        // Hacemos clic en el enlace del cliente encontrado
        await this.page.getByLabel('Select an item from this list').getByRole('link', { name: accountName }).click();
    }

    async createNewOrder(startDate: string) {
        await this.page.getByRole('tab', { name: 'Related' }).click();
        await this.page.getByRole('button', { name: 'New Order' }).click();

        // Es más estable escribir la fecha que intentar navegar por los botones del calendario
        const dateInput = this.page.getByRole('textbox', { name: 'Order Start Date' });
        await dateInput.click();
        await dateInput.fill(startDate); 
        await this.page.getByRole('button', { name: 'Save', exact: true }).click();
    }

    async addProducts(products: string[]) {
        await this.page.getByRole('button', { name: 'Add Products' }).click();

        // Iteramos sobre la lista para buscar y seleccionar cada producto independientemente de su posición
        for (const product of products) {
            const productRow = this.page.getByRole('row').filter({ hasText: product });
            await expect(productRow).toBeVisible();
            await productRow.locator('.slds-checkbox--faux').click();
        }

        await this.page.getByRole('button', { name: 'Next' }).click();
    }

    async editOrderLines() {
        // Nota: Si en el futuro necesitas que las características también sean parámetros, 
        // puedes pasar un objeto a esta función. Por ahora, encapsulamos tu lógica de CodeGen.
        
        // Producto 1 (Ej. Arrachindro)
        await this.page.getByRole('button', { name: /Edit Quantity/ }).first().click();
        await this.page.getByRole('textbox', { name: 'Quantity *' }).fill('4');
        await this.page.getByRole('textbox', { name: 'Quantity *' }).press('Enter');

        // Producto 2 (Ej. Sprite)
        // Usamos .nth(1) asumiendo que es la segunda línea de producto editable mostrada
        await this.page.getByRole('button', { name: /Edit Quantity/ }).nth(1).click();
        await this.page.getByRole('textbox', { name: 'Quantity *' }).fill('2');
        await this.page.getByRole('textbox', { name: 'Quantity *' }).press('Enter');

        // Detalles del primer producto
        await this.page.getByRole('button', { name: /Edit Line Description/ }).first().click();
        await this.page.getByRole('textbox', { name: 'Line Description' }).fill('Doble queso');

        await this.page.getByRole('button', { name: /Edit Aderezo/ }).first().click();
        await this.page.getByRole('button', { name: 'Aderezo', exact: true }).click();
        await this.page.getByRole('option', { name: 'Jalapindro' }).click();

        await this.page.getByRole('button', { name: /Edit Empanizado/ }).first().click();
        await this.page.getByRole('button', { name: 'Empanizado', exact: true }).click();
        await this.page.getByRole('option', { name: 'Panindro' }).click();

        await this.page.getByRole('button', { name: 'Save' }).click();
    }

    async verifyOrderSuccess() {
        await expect(this.page.getByRole('button', { name: 'App Launcher' })).toBeVisible();
    }
}