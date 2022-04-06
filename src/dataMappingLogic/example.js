import { dia } from '@clientio/rappid'
import { Link, Record } from './shapes'
import init from './init'

const { inputShape, objectMapperShape, outputShape, objectMapperValues } = init()

export const loadExample = function (graph) {

    const inputTransformer = new Record({
        decorators : {
            user_email : 'fx1()',
            address_street : 'fx2()',
        },
        items : [
            inputShape,
        ],
    }).setName('inputJson')
        .position(100, 200)
        .addTo(graph)


    const ObjectMapper = new Record({
        items : [[
            objectMapperShape,
        ]],
    })
        .setName('ObjectMapperSchema')
        .position(400, 100)
        .addTo(graph)

    const outputTransformer = new Record({
        decorators : {
            user_email : 'fx1()',
            address_street : 'fx2()',
        },
        items : [
            outputShape,
        ],
    })
        .setName('outputShape')
        .position(750, 200)
        .addTo(graph)

    const createLinks = () => {
        const links = []
        objectMapperValues.forEach(id => {
            const targetId = id.replace('data.', '')
            links.push(
                new Link({
                    source : { id : ObjectMapper.id, port : id },
                    target : { id : outputTransformer.id, port : targetId },
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
