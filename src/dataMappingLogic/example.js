import { Link, Record } from './shapes'

import { createLinks } from './init'

const records = {
    InputRecord: null,
    ObjectMapperRecord: null,
    outputRecord: null
}


const loadExample = function (graph, shapes, options) {

    const InputRecord = new Record(['edit', 'add-next-sibling', 'add-prev-sibling', 'remove'], {
        items: [
            shapes.inputShape,
        ],
    }).setName('input JSON')
        .position(100, 200)
        .addTo(graph)

    const ObjectMapperRecord = new Record(['edit'], {
        items: [
            shapes.objectMapperShape,
        ],
    }).setName('Mapping Schema')
        .position(400, 100)
        .addTo(graph)

    const OutputRecord = new Record([], {
        decorators: {
            user_email: 'fx1()',
            address_street: 'fx2()',
        },
        items: [
            shapes.outputShape,
        ],
    })
        .setName('output JSON')
        .position(750, 200)
        .addTo(graph)

    records.InputRecord = InputRecord
    records.ObjectMapperRecord = ObjectMapperRecord
    records.outputRecord = OutputRecord
    records.list = [InputRecord, ObjectMapperRecord, OutputRecord]

    // createInputLinks(links)
    let links = createLinks(InputRecord, ObjectMapperRecord, options.inputToObjectMapper)
    links = links.concat(createLinks(ObjectMapperRecord, OutputRecord, options.objectMapperToOutput))
    // Array.prototype.push.apply(links, createOutputLinks())
    links.forEach(function (link) {
        link.addTo(graph)
    })
}
export {
    loadExample,
    records
}