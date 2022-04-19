import { Link, Record } from './shapes'
import init from './init'

// const { inputShape, objectMapperShape, outputShape, objectMapperValues } = init()

const records_ids = {
    inputTransformer: null,
    ObjectMapper: null,
    outputTransformer: null
}

const loadExample = function (graph, shapes, options) {

    const inputTransformer = new Record({
        items: [
            shapes.inputShape,
        ],
    }).setName('inputJson')
        .position(100, 200)
        .addTo(graph)


    const ObjectMapper = new Record({
        items: [[
            shapes.objectMapperShape,
        ]],
    })
        .setName('ObjectMapperSchema')
        .position(400, 100)
        .addTo(graph)

    const outputTransformer = new Record({
        decorators: {
            user_email: 'fx1()',
            address_street: 'fx2()',
        },
        items: [
            shapes.outputShape,
        ],
    })
        .setName('outputShape')
        .position(750, 200)
        .addTo(graph)

    // records_ids.inputTransformer = inputTransformer.id
    // records_ids.ObjectMapper = ObjectMapper.id
    // records_ids.outputTransformer = outputTransformer.id

    const createLinks = () => {
        const links = []
        options.objectMapperValues.forEach(id => {
            const targetId = id.replace('data.', '')
            console.log(inputTransformer)

            links.push(
                new Link({
                    source: { id: ObjectMapper.id, port: id },
                    target: { id: outputTransformer.id, port: targetId },
                }),
            )
        })
        return links
    }
    const links = createLinks()


    links.forEach(function (link) {
        link.addTo(graph)
    })
}
export {
    loadExample,
    records_ids
}