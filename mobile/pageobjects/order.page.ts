import { $, browser } from '@wdio/globals';

class OrderPage {
    get accountRecord() { return $('(//XCUIElementTypeButton[@name="Cristian Axel Martínez, Account"])[2]'); }
    get relatedTab() { return $('~Related'); }
    get ordersSection() { return $('~Orders, artículo'); }
    get inQueuePath() { return $('~In Queue'); } 
    get markCompleteBtn() { return $('~Mark Status as Complete'); } 

    // --- TU NUEVO SELECTOR INFALIBLE ---
    get specificOrderLink() { 
        return $('(//XCUIElementTypeLink[@name="00000116"])[1]/XCUIElementTypeLink[2]'); 
    }
}

export default new OrderPage();