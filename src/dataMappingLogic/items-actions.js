// import { ui, util } from '@OtailO-recommerce/rappid';
//
// export function showElementTools(elementView) {
//     const element = elementView.model;
//     const padding = util.normalizeSides(element.get('padding'));
//     const isScrollable = (element.get('type') === 'mapping.Record');
//     const transform = new ui.FreeTransform({
//         cellView: elementView,
//         allowRotation: false,
//         resizeDirections: (isScrollable)
//             ? ['top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left']
//             : ['left', 'right'],
//         minWidth: function () {
//             return element.getMinimalSize().width;
//         },
//         minHeight: (isScrollable)
//             ? padding.top + padding.bottom
//             : 0
//     });
//     transform.render();
// }
//
// export function elementActionPicker(target, elementView, tools) {
//
//     const element = elementView.model;
//     const toolbar = new ui.ContextToolbar({
//         target: target.firstChild,
//         padding: 5,
//         vertical: true,
//         tools: tools
//     });
//
//     toolbar.render();
//     toolbar.on({
//         'action:remove': function () {
//             toolbar.remove();
//             element.remove();
//         },
//         'action:add-item': function () {
//             toolbar.remove();
//             element.addItemAtIndex(0, Infinity, element.getDefaultItem());
//         }
//     });
// }
//
//
//



const a = {
    "coordinates": {
        "lat": {
            "_path": ".lat",
            "_type": "Leaf"
        },
        "long": {
            "_path": ".long",
            "_type": "Leaf"
        },
        "_type": "Object"
    },
    "name": {
        "_path": ".name",
        "_type": "Leaf"
    },
    "address": {
        "country": {
            "_path": ".country_code",
            "_type": "Leaf",
            "_transformerCode": "console.log('allalala')"
        },
        "country_code": {
            "_path": ".country_code",
            "_type": "Leaf"
        },
        "street": {
            "_path": ".street",
            "_default": "asasasassa",
            "_type": "Leaf"
        },
        "street2": {
            "_path": ".street2",
            "_type": "Leaf"
        },
        "city": {
            "_path": ".city",
            "_type": "Leaf"
        },
        "state": {
            "_path": ".state",
            "_type": "Leaf"
        },
        "zip_code": {
            "_path": ".zip_code",
            "_type": "Leaf"
        },
        "phone_number": {
            "_path": ".phone_number",
            "_type": "Leaf"
        },
        "_type": "Object"
    },
    "_type": "Object"
}