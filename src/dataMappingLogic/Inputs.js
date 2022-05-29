export const selectBox = new joint.ui.SelectBox({
    width: 250,
    options: [
        { icon: "mapper/object.svg", content: 'Object', selected: true },
        { icon: "mapper/array.svg", content: 'Array' },
        { icon: "mapper/document.svg", content: 'Leaf' }
    ]
});
