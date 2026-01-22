let calculationResult = null;

const data = {
    minOrder: 4000.0,
    packaging: {
        'БОПП 150/120': 5,
        'БОПП 380/150': 7,
        'БОПП 360/230': 8,
        'БОПП 450/320': 11,
        'БОПП 550/450': 15,
        'Zip 150/200': 5,
        'Zip 200/300': 8,
        'Zip 250/350': 11,
        'Zip 300/400': 13,
        'Zip 350/450': 15,
        'Zip 400/500': 17,
        'Zip-lock 150/200': 12,
        'Zip-lock 200/250': 14,
        'Zip-lock 300/250': 16,
        'Zip-lock 300/400': 22,
        'Zip-lock 350/450': 24,
        'Zip-lock 400/500': 30,
        'Zip-lock 500/700': 44,
        'Курьер 150/210': 7,
        'Курьер 240/320': 14,
        'Курьер 340/460': 23,
        'Курьер 600/600': 57,
        'Термо 250мм/650мп': 8,
        'Термо 400мм/650мп': 10,
        'Термо 450мм/650мп': 11,
        'Запайка 200мм/330мп': 11,
        'Запайка 300мм/330мп': 13,
        'Запайка 500мм/250мп': 22,
        'Запайка 100мм/650мп': 7,
        'ВПП 15см/1м': 8,
        'ВПП 35см/1м': 15,
        'ВПП 75см/1м': 31,
        'Упаковка в пакет клиента': 7,
        'Сборка коробки': 7,
    },
    marking: {
        'ШК': 7,
        'КИЗ/ЧЗ': 8,
        'Совмещ. этикетка': 10,
    },
    quality: {
        "Легкая проверка (царапки, сколы, трещины)": 7,
        "Обычная проверка (футболки, трусики, шортики и т.п.)": 12,
        "Средняя проверка ( костюмы, свитшоты, ветровки и т.п)": 19,
        "Тяжелая проверка (зимние куртки, техника вкл. и выкл.)": 47,
    }
};

function customRound(num) {
    return Math.floor(num) + (num % 1 >= 0.5 ? 1 : 0);
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function hasAdditionalServices() {
    for (let i = 0; i < 2; i++) {
        if (document.getElementById(`toggle_packaging${i}`).checked) {
            const type = document.getElementById(`packaging${i}`).value;
            const qty = parseFloat(document.getElementById(`packaging_qty${i}`).value) || 0;
            if (type && qty > 0) return true;
        }
    }

    for (let i = 0; i < 2; i++) {
        if (document.getElementById(`toggle_marking${i}`).checked) {
            const type = document.getElementById(`marking${i}`).value;
            const qty = parseFloat(document.getElementById(`marking_qty${i}`).value) || 0;
            if (type && qty > 0) return true;
        }
    }

    if (document.getElementById('toggle_quality').checked) {
        const qualityType = document.getElementById('quality').value;
        if (qualityType) return true;
    }

    if (document.getElementById('toggle_tag_qty').checked) {
        const tagQty = parseFloat(document.getElementById('tag_qty').value) || 0;
        if (tagQty > 0) return true;
    }

    if (document.getElementById('toggle_extra_actions').checked) {
        const extraActions = parseFloat(document.getElementById('extra_actions').value) || 0;
        if (extraActions > 0) return true;
    }

    if (document.getElementById('toggle_kit_qty').checked) {
        const kitQty = parseFloat(document.getElementById('kit_qty').value) || 0;
        if (kitQty > 0) return true;
    }

    if (document.getElementById('toggle_insertion_qty').checked) {
        const insertionQty = parseFloat(document.getElementById('insertion_qty').value) || 0;
        if (insertionQty > 0) return true;
    }

    return false;
}

function initSelects() {
    fillSelect('packaging0', data.packaging);
    fillSelect('packaging1', data.packaging);
    fillSelect('marking0', data.marking);
    fillSelect('marking1', data.marking);
    fillSelect('quality', data.quality, true);
}

function fillSelect(id, items, includeEmpty = false) {
    const select = document.getElementById(id);
    select.innerHTML = includeEmpty ? '<option value="">Выберите...</option>' : '';
    Object.keys(items).forEach(key => {
        if (key !== '') {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            select.appendChild(option);
        }
    });
}

function toggleGroup(checkboxId, groupId) {
    const checkbox = document.getElementById(checkboxId);
    const group = document.getElementById(groupId);
    group.classList.toggle('disabled-group', !checkbox.checked);
}

function initCheckboxes() {
    const personalDiscountCheckbox = document.getElementById('toggle_personal_discount');
    personalDiscountCheckbox.addEventListener('change', () => 
        toggleGroup('toggle_personal_discount', 'group_personal_discount')
    );
    toggleGroup('toggle_personal_discount', 'group_personal_discount');
    
    const unitMarkupCheckbox = document.getElementById('toggle_unit_markup');
    unitMarkupCheckbox.addEventListener('change', () => 
        toggleGroup('toggle_unit_markup', 'group_unit_markup')
    );
    toggleGroup('toggle_unit_markup', 'group_unit_markup');
    
    for(let i = 0; i < 2; i++) {
        const checkboxPack = document.getElementById(`toggle_packaging${i}`);
        checkboxPack.addEventListener('change', () => toggleGroup(`toggle_packaging${i}`, `group_packaging${i}`));
        toggleGroup(`toggle_packaging${i}`, `group_packaging${i}`);

        const checkboxMark = document.getElementById(`toggle_marking${i}`);
        checkboxMark.addEventListener('change', () => toggleGroup(`toggle_marking${i}`, `group_marking${i}`));
        toggleGroup(`toggle_marking${i}`, `group_marking${i}`);
    }

    const otherGroups = [
        ['toggle_quality', 'group_quality'],
        ['toggle_tag_qty', 'group_tag_qty'],
        ['toggle_extra_actions', 'group_extra_actions'],
        ['toggle_kit_qty', 'group_kit_qty'],
        ['toggle_insertion_qty', 'group_insertion_qty']
    ];

    otherGroups.forEach(([checkboxId, groupId]) => {
        const checkbox = document.getElementById(checkboxId);
        checkbox.addEventListener('change', () => toggleGroup(checkboxId, groupId));
        toggleGroup(checkboxId, groupId);
    });
}

async function calculate() {
    const resultElem = document.getElementById('result');
    const pdfButton = document.getElementById('pdfButton');
    const previewButton = document.getElementById('previewButton');
    
    try {
        resultElem.innerHTML = '';
        pdfButton.disabled = true;
        previewButton.disabled = true;

        const sku = parseInt(document.getElementById('sku').value);
        const quantity = parseInt(document.getElementById('quantity').value);
        if (isNaN(sku) || isNaN(quantity) || sku < 1 || quantity < 1) {
            throw new Error('Введите корректные положительные значения');
        }

        const hasServices = hasAdditionalServices();
        const baseCost = hasServices ? 20 : 25;

        const length = parseFloat(document.getElementById('length').value) || 0;
        const width = parseFloat(document.getElementById('width').value) || 0;
        const height = parseFloat(document.getElementById('height').value) || 0;
        const volume = (length * width * height) / 1000;
        const volumeMultiplier = volume > 30 ? 1.3 : 1.0;

        let personalDiscountPercent = 0;
        let personalDiscountApplied = false;
        if (document.getElementById('toggle_personal_discount').checked) {
            personalDiscountPercent = parseFloat(document.getElementById('personal_discount').value) || 0;
            if (personalDiscountPercent > 0) {
                personalDiscountApplied = true;
            }
        }

        const totalDiscountPercent = personalDiscountPercent;
        const totalDiscountMultiplier = 1 - totalDiscountPercent / 100;

        let costs = {
            base: quantity * baseCost,
            skuSurcharge: sku > 50 ? 2 * quantity : 0,
            packaging: 0,
            marking: 0,
            quality: 0,
            tags: 0,
            kit: 0,
            insertion: 0,
            extra: 0
        };

        let serviceDetails = {};

        let packagingDetails = [];
        for (let i = 0; i < 2; i++) {
            if (!document.getElementById(`toggle_packaging${i}`).checked) continue;
            const type = document.getElementById(`packaging${i}`).value;
            const qty = parseFloat(document.getElementById(`packaging_qty${i}`).value) || 0;
            if (type && qty > 0) {
                costs.packaging += (data.packaging[type] || 0) * qty * quantity;
                packagingDetails.push(`${type} (${qty} слоёв)`);
            }
        }
        if (packagingDetails.length > 0) {
            serviceDetails.packaging = packagingDetails.join(', ');
        }

        let markingDetails = [];
        for (let i = 0; i < 2; i++) {
            if (!document.getElementById(`toggle_marking${i}`).checked) continue;
            const type = document.getElementById(`marking${i}`).value;
            const qty = parseFloat(document.getElementById(`marking_qty${i}`).value) || 0;
            
            let pricePerItem;
            if (type === 'ШК') {
                pricePerItem = qty === 1 ? 8 : 5;
            } else if (type === 'КИЗ/ЧЗ') {
                pricePerItem = 6;
            } else if (type === 'Совмещ. этикетка') {
                pricePerItem = 8;
            } else {
                pricePerItem = data.marking[type] || 0;
            }
            
            costs.marking += pricePerItem * qty * quantity;
            markingDetails.push(`${type} (${qty} шт. на ед.)`);
        }
        if (markingDetails.length > 0) {
            serviceDetails.marking = markingDetails.join(', ');
        }

        if (document.getElementById('toggle_quality').checked) {
            const qualityType = document.getElementById('quality').value;
            costs.quality = (data.quality[qualityType] || 0) * quantity;
            serviceDetails.quality = qualityType;
        }

        if (document.getElementById('toggle_tag_qty').checked) {
            const tagQty = parseFloat(document.getElementById('tag_qty').value) || 0;
            costs.tags = 3 * tagQty * quantity;
            serviceDetails.tags = `${tagQty} шт. на единицу`;
        }

        if (document.getElementById('toggle_extra_actions').checked) {
            const extraActions = parseFloat(document.getElementById('extra_actions').value) || 0;
            costs.extra = 3 * extraActions * quantity;
            const extraDesc = document.getElementById('extra_actions_desc').value.trim();
            if (extraDesc) {
                serviceDetails.extra = `${extraActions} действий: ${extraDesc}`;
            } else {
                serviceDetails.extra = `${extraActions} действий`;
            }
        }

        if (document.getElementById('toggle_kit_qty').checked) {
            const kitQty = parseFloat(document.getElementById('kit_qty').value) || 0;
            costs.kit = 3 * kitQty * quantity;
            serviceDetails.kit = `${kitQty} единиц в комплекте`;
        }

        if (document.getElementById('toggle_insertion_qty').checked) {
            const insertionQty = parseFloat(document.getElementById('insertion_qty').value) || 0;
            costs.insertion = 2 * insertionQty * quantity;
            serviceDetails.insertion = `${insertionQty} шт. на единицу`;
        }

        let unitMarkup = 0;
        if (document.getElementById('toggle_unit_markup').checked) {
            unitMarkup = parseFloat(document.getElementById('unit_markup').value) || 0;
        }
        const markupTotal = unitMarkup * quantity;

        if (markupTotal > 0) {
            costs.base += markupTotal;
            serviceDetails.baseMarkup = `Наценка: ${unitMarkup} руб./ед.`;
        }

        let totalWithoutVolume = Object.values(costs).reduce((a, b) => a + b, 0);
        let totalAfterVolume = totalWithoutVolume * volumeMultiplier;
        
        const totalAfterDiscount = totalAfterVolume * totalDiscountMultiplier;
        
        const total = Math.max(totalAfterDiscount, data.minOrder);
        
        const perUnit = total / quantity;

        calculationResult = { 
            costs, 
            total, 
            perUnit,
            totalWithoutDiscount: totalAfterVolume,
            totalAfterDiscount: total,
            personalDiscountPercent,
            personalDiscountApplied,
            totalDiscountPercent,
            volumeMultiplier,
            sku: parseInt(document.getElementById('sku').value),
            quantity: parseInt(document.getElementById('quantity').value),
            length: parseFloat(document.getElementById('length').value) || 0,
            width: parseFloat(document.getElementById('width').value) || 0,
            height: parseFloat(document.getElementById('height').value) || 0,
            unitMarkup: unitMarkup,
            markupTotal: markupTotal,
            baseCost: baseCost,
            hasServices: hasServices,
            serviceDetails: serviceDetails
        };

        resultElem.innerHTML = `
            ${Object.entries(costs).map(([key, value]) => `
                <div class="report-item">
                    <span>${getLabel(key)}:</span>
                    <span>${customRound(value).toFixed(0)} руб.</span>
                </div>
            `).join('')}
            ${volumeMultiplier > 1 ? `
            <div class="report-item">
                <span>Надбавка за объем (+${(volumeMultiplier-1)*100}%):</span>
                <span>${customRound(totalWithoutVolume * (volumeMultiplier-1)).toFixed(0)} руб.</span>
            </div>` : ''}
            <div class="report-item report-total">
                <span>Итого к оплате:</span>
                <span>${customRound(total).toFixed(0)} руб.</span>
            </div>
            <div class="report-item report-unit">
                <span>Стоимость за единицу:</span>
                <span>${customRound(perUnit).toFixed(0)} руб.</span>
            </div>
        `;

        pdfButton.disabled = false;
        previewButton.disabled = false;
    } catch (e) {
        resultElem.innerHTML = `<div class="error">${e.message}</div>`;
        pdfButton.disabled = true;
        previewButton.disabled = true;
    }
}

function getLabel(key) {
    const labels = {
        base: 'Приемка',
        skuSurcharge: 'Надбавка за SKU',
        packaging: 'Упаковка',
        marking: 'Маркировка',
        quality: 'Проверка качества',
        tags: 'Бирки',
        kit: 'Комплектация',
        insertion: 'Вложения',
        extra: 'Доп. действия'
    };
    return labels[key] || key;
}

function generatePDFContent() {
    if (!calculationResult) return '';
    
    const filteredCosts = Object.entries(calculationResult.costs)
        .filter(([_, value]) => value > 0);

    const serviceDescriptions = {
        base: 'Разгрузка, пересчёт, фасовка по размерам и цветам',
        marking: 'Печать и наклейка ШК/КИЗ/ЧЗ/Совмещ. этикетки',
        packaging: 'Упаковка в пакет/коробку согласно спецификации',
        tags: 'Прикрепление бирок этикет-пистолетом или на застежку',
        kit: 'Комплектация товара в наборы',
        extra: 'Дополнительные действия с товаром',
        quality: 'Контроль качества и устранение брака',
        insertion: 'Добавление вложений (подарки, визитки)'
    };

    const hasDimensions = calculationResult.length + calculationResult.width + calculationResult.height > 0;
    const hasParams = calculationResult.sku || calculationResult.quantity || hasDimensions;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const offerId = `EP-${Date.now().toString().slice(-6)}`;
    
    const serviceCount = filteredCosts.length;
    let scaleFactor = 1.0;
    if (serviceCount > 5) scaleFactor = 0.95;
    if (serviceCount > 6) scaleFactor = 0.90;
    if (serviceCount > 7) scaleFactor = 0.85;
    if (serviceCount > 8) scaleFactor = 0.80;
    
    const scale = (value) => Math.round(value * scaleFactor * 10) / 10;
    const scaled = (value) => `${scale(value)}px`;
    
    const baseFontSize = scale(11);
    const titleFontSize = scale(13);
    const headerFontSize = scale(18);
    const mainTitleFontSize = scale(26);
    const tableFontSize = scale(11);
    const tablePadding = scale(9);
    const sectionMargin = scale(12);
    const blockPadding = scale(12);
    const iconSize = scale(16);
    
    const managerName = document.getElementById('managerName').value || '';

    return `
        <div style="font-family: 'Inter', sans-serif; position: relative; min-height: 95vh; padding: ${scaled(25)}; background: #fff; font-size: ${baseFontSize}px; overflow: visible;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: ${scaled(15)}; border-bottom: 2px solid #F58220; margin-bottom: ${scaled(15)}; padding: 0 ${scaled(25)} ${scaled(10)}; color: #000;">
                <div>
                    <div style="font-size: ${mainTitleFontSize}px; font-weight: 700; letter-spacing: -0.5px; color: #F58220;">ПРО100ПАК</div>
                    <div style="font-size: ${scale(10)}px; color: #666; margin-top: ${scaled(3)};">Складские решения премиум-класса</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: ${headerFontSize}px; font-weight: 600; color: #000;">Коммерческое предложение</div>
                    <div style="font-size: ${scale(10)}px; color: #666; margin-top: ${scaled(3)};">№ ${offerId} от ${formattedDate}</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: ${scaled(20)}; margin-bottom: ${scaled(15)};">
                <div>
                    <div style="font-size: ${titleFontSize}px; font-weight: 600; color: #000; margin-bottom: ${scaled(5)};">Поставщик услуг</div>
                    <div style="font-size: ${scale(10)}px; line-height: 1.4; color: #444;">
                        <div><strong>ООО «ПРО100ПАК»</strong></div>
                        <div>г. Москва, ул. Стахановская, 18 ст1</div>
                        <div>Тел.: +7 (495) 162-85-00</div>
                        <div>Email: easypackmsk@bk.ru</div>
                        ${managerName ? `<div>Менеджер: ${managerName}</div>` : '<div>Менеджер:</div>'}
                    </div>
                </div>
                
                ${hasParams ? `
                <div style="background: #f8fafc; border-radius: ${scaled(8)}; padding: ${scaled(15)}; border: 1px solid #e6ecf0; box-shadow: 0 ${scaled(2)} ${scaled(6)} rgba(0,0,0,0.03);">
                    <div style="font-size: ${titleFontSize}px; font-weight: 600; color: #000; margin-bottom: ${scaled(8)}; display: flex; align-items: center;">
                        <svg style="margin-right: ${scaled(6)};" width="${iconSize}px" height="${iconSize}px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M3.27 6.96L12 12.01 20.73 6.96M12 22.08V12" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Параметры товара
                    </div>
                    <div style="font-size: ${scale(10)}px; line-height: 1.4; color: #444;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: ${scaled(4)};">
                            <span style="color: #666;">SKU:</span>
                            <strong>${calculationResult.sku}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: ${scaled(4)};">
                            <span style="color: #666;">Кол-во:</span>
                            <strong>${calculationResult.quantity} шт.</strong>
                        </div>
                        ${hasDimensions ? `
                        <div style="display: flex; justify-content: space-between; margin-bottom: ${scaled(4)};">
                            <span style="color: #666;">Длина:</span>
                            <strong>${calculationResult.length.toFixed(1)} см</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: ${scaled(4)};">
                            <span style="color: #666;">Ширина:</span>
                            <strong>${calculationResult.width.toFixed(1)} см</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #666;">Высота:</span>
                            <strong>${calculationResult.height.toFixed(1)} см</strong>
                        </div>` : ''}
                    </div>
                </div>` : ''}
            </div>

            <div style="margin-bottom: ${scaled(15)};">
                <div style="font-size: ${titleFontSize}px; font-weight: 600; color: #000; margin-bottom: ${scaled(10)}; display: flex; align-items: center;">
                    <svg style="margin-right: ${scaled(8)};" width="${iconSize}px" height="${iconSize}px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    Детализация услуг
                </div>
                
                <table style="width: 100%; border-collapse: collapse; font-size: ${tableFontSize}px; margin-bottom: ${scaled(15)};">
                    <thead>
                        <tr style="background: #F58220; color: #fff;">
                            <th style="padding: ${tablePadding}px ${scaled(12)}; text-align: left; width: 70%;">Услуга</th>
                            <th style="padding: ${tablePadding}px ${scaled(12)}; text-align: left; width: 30%;">Детали услуги</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredCosts.map(([key, value], index) => `
                            <tr style="${index % 2 === 0 ? 'background: #f8fafc;' : ''}">
                                <td style="padding: ${tablePadding}px ${scaled(12)}; border-bottom: 1px solid #e6ecf0;">
                                    <div style="font-weight: 500;">${getLabel(key)}</div>
                                    <div style="font-size: ${scale(9)}px; color: #666; margin-top: ${scaled(2)};">${serviceDescriptions[key] || ''}</div>
                                </td>
                                <td style="padding: ${tablePadding}px ${scaled(12)}; text-align: left; border-bottom: 1px solid #e6ecf0; font-weight: 500; font-size: ${scale(10)}px;">
                                    ${calculationResult.serviceDetails[key] || ''}
                                </td>
                            </tr>
                        `).join('')}
                        
                        ${calculationResult.volumeMultiplier > 1 ? `
                        <tr>
                            <td style="padding: ${tablePadding}px ${scaled(12)}; border-bottom: 1px solid #e6ecf0;">
                                <div style="font-weight: 500;">Надбавка за объем</div>
                                <div style="font-size: ${scale(9)}px; color: #666; margin-top: ${scaled(2)};">Доплата за габаритный товар (объем >30л)</div>
                            </td>
                            <td style="padding: ${tablePadding}px ${scaled(12)}; text-align: left; border-bottom: 1px solid #e6ecf0; font-weight: 500; font-size: ${scale(10)}px;">
                                Объем товара превышает 30 литров
                            </td>
                        </tr>` : ''}
                        
                        <tr style="background: #fef4e8;">
                            <td style="padding: ${scaled(12)}; text-align: right; font-weight: 700; font-size: ${scale(12)}px;" colspan="2">
                                ИТОГО: ${customRound(calculationResult.total).toFixed(0)} руб.
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div style="text-align: center; margin-top: ${scaled(10)}; margin-bottom: ${scaled(20)};">
                    <div style="background: #fef4e8; border-radius: ${scaled(8)}; padding: ${scaled(8)} ${scaled(15)}; display: inline-block; border: 1px solid #f9e0c5;">
                        <span style="font-size: ${scale(11)}px; color: #666; margin-right: ${scaled(8)};">Цена за единицу:</span>
                        <span style="font-size: ${scale(16)}px; font-weight: 700; color: #F58220;">${customRound(calculationResult.perUnit).toFixed(0)} руб.</span>
                    </div>
                </div>
            </div>

            <div style="border-top: 1px solid #e6ecf0; padding-top: ${scaled(15)}; margin-bottom: ${scaled(50)};">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: ${scaled(20)};">
                    <div style="font-size: ${scale(10)}px; color: #666; line-height: 1.4;">
                        <div style="font-weight: 600; color: #000; margin-bottom: ${scaled(5)}; display: flex; align-items: center;">
                            <svg style="margin-right: ${scaled(5)};" width="${scale(14)}px" height="${scale(14)}px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 8v4M12 16h.01" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            Условия предложения:
                        </div>
                        <div>• Срок действия: 30 календарных дней с даты формирования</div>
                        <div>• Минимальная стоимость заказа: 4 000 рублей</div>
                        <div>• Цены указаны без учета НДС</div>
                    </div>

                    <div style="display: flex; align-items: center; justify-content: center;">
                        <a href="https://drive.google.com/file/d/19dcddZaaQdVv9_Z5TbxrZxbkSP9RjoK0/view?usp=sharing" 
                           target="_blank"
                           style="text-decoration: none; color: #000; font-weight: 500; display: flex; align-items: center; gap: ${scaled(8)}; padding: ${scaled(10)} ${scaled(15)}; background: #f8fafc; border-radius: ${scaled(8)}; border: 1px solid #e0e7ed; transition: all 0.2s;">
                            <svg width="${scaled(16)}" height="${scaled(16)}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            График отгрузок и стоимость
                        </a>
                    </div>
                </div>
            </div>

            <div style="position: absolute; bottom: 0; left: 0; right: 0; font-size: ${scale(8)}px; color: #666; padding: ${scaled(10)} ${scaled(25)}; background: #f8fafc; line-height: 1.4; border-top: 1px solid #e6ecf0; text-align: center;">
                <div style="max-width: 700px; margin: 0 auto;">
                    КОНФИДЕНЦИАЛЬНО: Данный документ содержит конфиденциальную информацию. Любое несанкционированное распространение запрещено.
                </div>
                <div style="margin-top: ${scaled(3)};">© 2025 ПРО100ПАК</div>
            </div>
        </div>
    `;
}

async function generatePDF(save = true) {
    if (!calculationResult) {
        alert('Сначала выполните расчет');
        return;
    }
    
    if (isMobileDevice() && !save) {
        generatePDFPreview();
        return;
    }
    
    const pdfContent = generatePDFContent();
    
    const opt = {
        margin: 10,
        filename: `ПРО100ПАК_КП_${Date.now().toString().slice(-6)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            letterRendering: true,
            logging: false,
            backgroundColor: '#ffffff'
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            hotfixes: ["px_scaling"]
        }
    };

    try {
        const pdfButton = document.getElementById('pdfButton');
        const originalButtonText = pdfButton.innerHTML;
        pdfButton.innerHTML = '<span class="spinner"></span> Генерация...';
        pdfButton.disabled = true;

        const pdfBlob = await html2pdf().set(opt).from(pdfContent).output('blob');
        
        const a = document.createElement('a');
        a.href = URL.createObjectURL(pdfBlob);
        a.download = opt.filename;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        }, 100);
        
    } catch (e) {
        console.error('PDF generation error:', e);
        alert('Ошибка при создании PDF: ' + e.message);
    } finally {
        const pdfButton = document.getElementById('pdfButton');
        pdfButton.innerHTML = isMobileDevice() ? 'Открыть PDF' : 'Скачать PDF';
        pdfButton.disabled = false;
    }
}

function generatePDFPreview() {
    if (!calculationResult) {
        alert('Сначала выполните расчет');
        return;
    }
    
    const pdfContent = generatePDFContent();
    const previewWindow = window.open('', '_blank', 'width=800,height=900,scrollbars=1');
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Просмотр КП</title>
            <style>
                body { 
                    margin: 0; 
                    padding: 20px; 
                    background-color: #f0f2f5; 
                    font-family: 'Inter', sans-serif;
                }
                .preview-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                    padding: 20px;
                }
                .preview-header {
                    text-align: center;
                    padding: 15px 0;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #e0e0e0;
                }
                .preview-title {
                    font-size: 24px;
                    color: #000;
                    margin-bottom: 10px;
                }
                .preview-actions {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 20px;
                }
                .preview-btn {
                    padding: 10px 25px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .preview-btn-download {
                    background: linear-gradient(135deg, #F58220 0%, #D96D0D 100%);
                    color: white;
                }
                .preview-btn-close {
                    background: #e0e0e0;
                    color: #333;
                }
                .preview-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
                .spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                    margin-right: 8px;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <div class="preview-container">
                <div class="preview-header">
                    <div class="preview-title">Предпросмотр коммерческого предложения</div>
                    <div>Проверьте документ перед сохранением</div>
                </div>
                <div id="pdf-content">${pdfContent}</div>
                <div class="preview-actions">
                    <button class="preview-btn preview-btn-download" onclick="window.opener.generatePDF(true); window.close();">Скачать PDF</button>
                    <button class="preview-btn preview-btn-close" onclick="window.close();">Закрыть</button>
                </div>
            </div>
        </body>
        </html>
    `;

    previewWindow.document.open();
    previewWindow.document.write(html);
    previewWindow.document.close();
}

window.addEventListener('DOMContentLoaded', () => {
    initSelects();
    initCheckboxes();
    
    if (isMobileDevice()) {
        const pdfButton = document.getElementById('pdfButton');
        if (pdfButton) {
            pdfButton.textContent = 'Открыть PDF';
        }
    }
});
