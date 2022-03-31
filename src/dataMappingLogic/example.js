import { Link, Record } from './shapes';
import init from './utilsTransform';
export const loadExample = function (graph) {
    const objectMapperSchema2Shape = init();
    console.log(objectMapperSchema2Shape);
    const ObjectMapper = new Record({
        items: [[
                objectMapperSchema2Shape
            ]]
    })
        .setName('ObjectMapper')
        .position(400, 100)
        .addTo(graph);
    const outputTransformer = new Record({
        decorators: {
            user_email: 'fx1()',
            address_street: 'fx2()'
        },
        items: [
            [objectMapperSchema2Shape]
        ]
    })
        .setName('outputTransformer')
        .position(750, 200)
        .addTo(graph);
    const inputTransformer = new Record({
        decorators: {
            user_email: 'fx1()',
            address_street: 'fx2()'
        },
        items: [
            [objectMapperSchema2Shape]
        ]
    })
        .setName('inputTransformer')
        .position(100, 200)
        .addTo(graph);
    // const constant1 = new Constant()
    //     .setValue('Order')
    //     .position(240, 10)
    //     .addTo(graph);
    //
    // const constant2 = new Constant()
    //     .setValue('.dat')
    //     .position(240, 40)
    //     .addTo(graph);
    //
    // const constant3 = new Constant()
    //     .setValue(' ')
    //     .position(240, 70)
    //     .addTo(graph);
    //
    // const concat1 = new Concat()
    //     .position(450, 0)
    //     .addTo(graph);
    //
    // const concat2 = new Concat()
    //     .position(450, 120)
    //     .addTo(graph);
    //
    // const getDate1 = new GetDate()
    //     .position(450, 310)
    //     .addTo(graph);
    const links = [
        // concat1
        // new Link({
        //     source: { id: constant1.id, port: 'value' },
        //     target: { id: concat1.id, port: 'value_1' }
        // }),
        // new Link({
        //     source: { id: nanonull.id, port: 'order_id' },
        //     target: { id: concat1.id, port: 'value_2' }
        // }),
        // new Link({
        //     source: { id: constant2.id, port: 'value' },
        //     target: { id: concat1.id, port: 'value_3' }
        // }),
        // new Link({
        //     source: { id: concat1.id, port: 'result' },
        //     target: { id: order.id, port: 'file' }
        // }),
        // // concat2
        // new Link({
        //     source: { id: nanonull.id, port: 'user_first_name' },
        //     target: { id: concat2.id, port: 'value_1' }
        // }),
        // new Link({
        //     source: { id: constant3.id, port: 'value' },
        //     target: { id: concat2.id, port: 'value_2' }
        // }),
        // new Link({
        //     source: { id: nanonull.id, port: 'user_last_name' },
        //     target: { id: concat2.id, port: 'value_3' }
        // }),
        // new Link({
        //     source: { id: concat2.id, port: 'result' },
        //     target: { id: order.id, port: 'order_name' }
        // }),
        // // getDate1
        // new Link({
        //     source: { id: nanonull.id, port: 'user_created_at' },
        //     target: { id: getDate1.id, port: 'value' }
        // }),
        // new Link({
        //     source: { id: getDate1.id, port: 'year' },
        //     target: { id: order.id, port: 'entry_date_year' }
        // }),
        // new Link({
        //     source: { id: getDate1.id, port: 'month' },
        //     target: { id: order.id, port: 'entry_date_month' }
        // }),
        // new Link({
        //     source: { id: getDate1.id, port: 'day' },
        //     target: { id: order.id, port: 'entry_date_day' }
        // }),
        // order
        // new Link({
        //     source: { id: nanonull.id, port: 'order_id' },
        //     target: { id: order.id, port: 'order_id' }
        // }),
        // new Link({
        //     source: { id: nanonull.id, port: 'user_email' },
        //     target: { id: order.id, port: 'order_email' }
        // }),
        // new Link({
        //     source: { id: nanonull.id, port: 'addresses' },
        //     target: { id: order.id, port: 'address' }
        // }),
        // new Link({
        //     source: { id: nanonull.id, port: 'address_is_billing' },
        //     target: { id: order.id, port: 'address_billing' }
        // }),
        // new Link({
        //     source: { id: nanonull.id, port: 'address_is_shipping' },
        //     target: { id: order.id, port: 'address_shipping' }
        // }),
        //
        // new Link({
        //     source: { id: nanonull.id, port: 'address_city' },
        //     target: { id: order.id, port: 'address_city' }
        // }),
        new Link({
            source: { id: ObjectMapper.id, port: 'outputTransformer' },
            target: { id: outputTransformer.id, port: 'outputTransformer' }
        }),
        new Link({
            source: { id: outputTransformer.id, port: 'outputTransformer' },
            target: { id: inputTransformer.id, port: 'outputTransformer' }
        }),
    ];
    links.forEach(function (link) {
        link.addTo(graph);
    });
};
//# sourceMappingURL=example.js.map