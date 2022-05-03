import { records } from './example';

function checkRecordLinkConnection(linkView, logs = []) {
    const validation = { isValid: false, logs }
    if ((linkView.model.attributes.source.id === records.ObjectMapperRecord.id)
        && (linkView.model.attributes.target.id === records.outputRecord.id)) {
        validation.logs.push(['Not Allowed to pass', 'linkView.model.attributes.target.id !== records.outputRecord.id', 'linkView.model.attributes.source.id !== records.ObjectMapperRecord.id'])
        return validation
    }
    validation.isValid = true
    return validation
}

function checkRecordLinkDisconnect(linkView, element, arrowhead, logs = []) {
    const validation = { isValid: false, logs }
    if (arrowhead !== 'source') {
        validation.isValid = true
        return validation
    }

    if (element.id !== records.InputRecord.id) {
        validation.isValid = true
        return validation
    }

    if (linkView.model._previousAttributes.source.port !== linkView.model.attributes.source.port) {
        validation.logs.push(['Not Allowed to pass', '_previousAttributes.source.port !== attributes.source.port',])
        validation.isValid = false
        return validation
    }
}

export function chekLinksRules(eventName, linkView, evt, element, magnet, arrowhead) {
    switch (eventName) {
        case 'link:mousewheel':
            return true

        case 'link:connect':
            return true

        case 'link:disconnect':
            return checkRecordLinkDisconnect(linkView, element, arrowhead)

        case 'link:pointerclick':
            return checkRecordLinkConnection(linkView)

        case 'link:mouseenter':
            return checkRecordLinkConnection(linkView)

        case 'link:mouseleave':
            return true
    }
}