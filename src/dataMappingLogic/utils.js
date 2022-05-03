import { ui } from '@clientio/rappid/';


// options example
const options = {
    title: 'Edit Item',
    content: 'ss',
    width: 300,
    closeButton: true,
    cancelButton: true,
    buttons: ['cancel', 'remove']
}

function _createButtons(buttons) {
    const result = []
    buttons.forEach(button => {
        switch (button) {
            case 'cancel':
                result.push({ content: 'Cancel', action: 'cancel' })
                break
            case 'change':
                result.push({
                    content: '<span style="color:#fe854f">Change</span>',
                    action: 'change'
                })
                break
            case 'remove' :
                result.push({
                    action: 'remove',
                    content: '<span style="color:#fe854f">Remove</span>'
                })
                break
            case 'confirm':
                result.push({
                    content: '<span style="color:#fe854f">Confirm</span>',
                    action: 'confirm'
                })
        }
    })
    return result
}

export function dialog(options) {
    return new ui.Dialog({
        width: options.width || 300,
        title: options.title || 'Edit Item',
        closeButton: options.closeButton || false,
        content: options.content || 'Try this Dialog Test',
        buttons: _createButtons(options.buttons)
    })
}