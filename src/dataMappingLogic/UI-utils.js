import { ui, util } from '@OtailO-recommerce/rappid';
import i18n from '../services/i18n.vue.mixin';
import Papa from 'papaparse';


export function createInspector(element, itemPath, config, title) {
    const inspector = new ui.Inspector({
        cell: element,
        live: false,
        inputs: config && itemPath ? util.setByPath({}, itemPath, config) : undefined,
        title: title ? title : '(data, context) => { Your Code is here }'
    });
    inspector.render();
    inspector.el.style.position = 'relative';
    inspector.el.style.overflow = 'hidden';
    return inspector
}

// Create Dialog
export function createDialog(options) {
    const _createButtons = (buttons) => {
        const result = []
        buttons.forEach(button => {
            switch (button) {
                case 'cancel':
                    result.push({
                        content: `${i18n.methods.t('cancel')}`,
                        action: 'cancel'
                    })
                    break
                case 'change':
                    result.push({
                        content: `<span style="color:#fe854f">${i18n.methods.t('change')}</span>`,
                        action: 'change'
                    })
                    break
                case 'toggle':
                    result.push({
                        content: `<span style="color:#fe854f">${i18n.methods.t('toggle')}</span>`,
                        action: 'toggle'
                    })
                    break
                case 'remove' :
                    result.push({
                        action: 'remove',
                        content: `<span style="color:#fe854f">${i18n.methods.t('remove')}</span>`
                    })
                    break
                case 'confirm':
                    result.push({
                        content: `<span style="color:#fe854f">${i18n.methods.t('confirm')}</span>`,
                        action: 'confirm'
                    })
                    break
                case 'ok':
                    result.push({
                        content: `<span style="color:#fe854f">${i18n.methods.t('ok')}</span>`,
                        action: 'ok'
                    })
                    break
            }
        })
        return result
    }

    return new ui.Dialog({
        width: options.width || 300,
        title: options.title || 'Edit Item',
        closeButton: options.closeButton || false,
        content: options.content || 'Try this Dialog Test',
        buttons: _createButtons(options.buttons)
    })
}

// uploadPoi(event) {
//     const file = event.files[0]
//     document.getElementsByClassName('file-select-name').innerText = 'Filename: ' + file.name
//
//     if (['text/csv', 'xlsx'].includes(file.type)) {
//         return Papa.parse(file, {
//             header: true,
//             skipEmptyLines: true,
//             complete: async function ({ data }) {
//                 const result = data
//             }
//         })
//
//     } else if (['text/plain', 'application/json'].includes(file.type)) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             const schema = JSON.parse(e.target.result)
//
//             this.createRecords(this.graph, schema.$root, ['remove'])
//             this.liveUpdateSchema()
//         }
//         reader.readAsBinaryString(file);
//     }
// },