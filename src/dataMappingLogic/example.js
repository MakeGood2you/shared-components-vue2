import i18nMixin from "../services/i18n.vue.mixin";
import { JsonRecord, MappingRecord } from './shapes'

import { createLinks, createHashLinks } from './init'

const records = {
    InputRecord: null,
    ObjectMapperRecord: null,
    outputRecord: null
}

let links = []
let hashLinks = {}


const loadExample = function (graph, shapes, options) {

    const InputRecord = new JsonRecord([], {
        items: [
            shapes.inputShape,
        ],
    }).setName(i18nMixin.methods.t('InputName'))
        .position(100, 200)
        .addTo(graph)

    const ObjectMapperRecord = new MappingRecord(['edit', 'add-next-sibling', 'add-prev-sibling', 'remove', 'add-child', 'edit-decorator'], {
        items: [
            shapes.objectMapperShape,
        ],
    }).setName(i18nMixin.methods.t('MappingSchema'))
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
        .setName(i18nMixin.methods.t('outputName'))
        .position(900, 200)
        .addTo(graph)

    records.InputRecord = InputRecord
    records.ObjectMapperRecord = ObjectMapperRecord
    records.outputRecord = OutputRecord
    records.list = [InputRecord, ObjectMapperRecord, OutputRecord]

    // createInputLinks(links)
    links = createLinks(InputRecord, ObjectMapperRecord, options.inputToObjectMapper, graph)
    links = links.concat(createLinks(ObjectMapperRecord, OutputRecord, options.objectMapperToOutput, graph))
    // hashLinks = createHashLinks(InputRecord, ObjectMapperRecord, options.inputToObjectMapper)
    debugger
    // const hashLinks2 =  createHashLinks(ObjectMapperRecord, OutputRecord, options.objectMapperToOutput)
    // Object.assign(hashLinks.byTarget, hashLinks2.byTarget)
    // Object.assign(hashLinks.bySource, hashLinks2.bySource)
    // Array.prototype.push.apply(links, createOutputLinks())
    links.forEach(function (link) {
        link.addTo(graph)
    })
}
export {
    loadExample,
    records,
    links,
    hashLinks
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