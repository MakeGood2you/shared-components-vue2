import { records } from './example';

function checkRecordLinkConnection(linkView, element, logs = []) {
    const validation = { isValid: false, logs }

    const targetId = linkView.model.attributes.target.id
    const sourceId = linkView.model.attributes.source.id

    // input record
    // if target is inputRecord is not valid
    if (targetId === records.InputRecord.id) return validation
    // validation.logs.push(['Not Allowed to connect', ' element.id === records.InputRecord'])

    // output record
    // if target is outputRecord is not valid
    if (targetId === records.outputRecord.id) return validation
    // validation.logs.push(['Not Allowed to connect', 'element.id === records.outputRecord.id'])

    //object mapper record
    //if source is outputRecord is not valid
    if (sourceId === records.outputRecord.id) return validation
    // validation.logs.push(['Not Allowed to connect', 'element.id === records.ObjectMapperRecord.id'])

    //object mapper record
    //if source is ObjectMapperRecord is not valid
    if (sourceId === records.ObjectMapperRecord.id) return validation
    // validation.logs.push(['Not Allowed to connect', ' element.id === records.ObjectMapperRecord.id'])

    if ((sourceId === records.ObjectMapperRecord.id) && (targetId === records.outputRecord.id)) return validation
    // validation.logs.push(['Not Allowed to pass', 'linkView.model.attributes.target.id !== records.outputRecord.id', 'linkView.model.attributes.source.id !== records.ObjectMapperRecord.id'])


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
        // validation.logs.push(['Not Allowed to pass', '_previousAttributes.source.port !== attributes.source.port',])
        validation.isValid = false
        return validation
    }
}

export function chekLinksRules(eventName, linkView, element, arrowhead) {
    switch (eventName) {
        case 'link:mousewheel':
            return true

        case 'link:connect':
            return checkRecordLinkConnection(linkView, element, arrowhead)

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