import { Link, JsonRecord, MappingRecord, Record } from './shapes'

import { createLinks } from './init'

const records = {
    InputRecord: null,
    ObjectMapperRecord: null,
    outputRecord: null
}


const loadExample = function (graph, shapes, options) {

    const InputRecord = new JsonRecord(['edit', 'add-next-sibling', 'add-prev-sibling', 'remove'], {
        items: [
            shapes.inputShape,
        ],
    }).setName('input JSON')
        .position(100, 200)
        .addTo(graph)

    const ObjectMapperRecord = new MappingRecord(['edit'], {
        items: [
            shapes.objectMapperShape,
        ],
    }).setName('Mapping Schema')
        .position(550, 100)
        .addTo(graph)

    const OutputRecord = new JsonRecord([], {
        decorators: {
            user_email: 'fx1()',
            address_street: 'fx2()',
        },
        items: [
            shapes.outputShape,
        ],
    })
        .setName('output JSON')
        .position(900, 200)
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

// link.on('change:source', function() {console.log('triggered when the link changes its source')})
// link.on('change:target', function() { console.log('triggered when the link changes its target') })
// link.on('change:attrs', function() { console.log('triggered when the link changes its attributes') })
// link.on('change:smooth', function() { console.log('(deprecated) triggered when the link toggled interpolation') })
// link.on('change:manhattan', function() { console.log('(deprecated) triggered when the link toggled orthogonal routing') })
// link.on('change:vertices', function() { console.log('triggered when the link changes its vertices array') })
// link.on('change:z', function() { console.log('triggered when the link is moved in the z-level (toFront and toBack)') })
// link.on('transition:start', function() { console.log('triggered when a transition starts.') })
// link.on('transition:end', function() { console.log('triggered when a transition ends') })