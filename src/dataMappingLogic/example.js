import { Link, Record } from './shapes'

// const { inputShape, objectMapperShape, outputShape, objectMapperToOutput } = init()

const records = {
    inputTransformer: null,
    ObjectMapper: null,
    outputTransformer: null
}

const createLinks = (sourceShape, targetShape, source2TargetInstance) => {
    const links = []
    source2TargetInstance.map(link => {
        links.push(
            new Link({
                source: { id: sourceShape.id, port: link.source },
                target: { id: targetShape.id, port: link.target },
            }),
        )
    })
    return links
}

const loadExample = function (graph, shapes, options) {

    const InputTransformer = new Record({
        items: [
            shapes.inputShape,
        ],
    }).setName('input JSON')
        .position(100, 200)
        .addTo(graph)


    const ObjectMapper = new Record({
        items: [
            shapes.objectMapperShape,
        ],
    })
        .setName('Mapping Schema')
        .position(400, 100)
        .addTo(graph)

    const OutputTransformer = new Record({
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

    records.InputTransformer = InputTransformer
    records.ObjectMapper = ObjectMapper
    records.OutputTransformer = OutputTransformer
    records.list = [InputTransformer, ObjectMapper, OutputTransformer]

    // createInputLinks(links)
    let links = createLinks(InputTransformer, ObjectMapper, options.inputToObjectMapper)
    links = links.concat(createLinks(ObjectMapper, OutputTransformer, options.objectMapperToOutput))
    // Array.prototype.push.apply(links, createOutputLinks())
    links.forEach(function (link) {
        link.addTo(graph)
    })
}
export {
    loadExample,
    records
}