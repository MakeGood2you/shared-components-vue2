// import { Link } from './shapes';
// import { dia } from '@OtailO-recommerce/rappid';
// import { Button, TargetArrowhead } from './link-tools';
// import i18n from '../services/i18n.vue.mixin';
//
//
// export function getLinkBySourcePort(element, id,graph) {
//     const connectedLinks = graph.getConnectedLinks(element)
//     return connectedLinks.find(link => link.attributes.source.port === id)
// }
//
// export function getLinkByTargetPort(element, id, graph) {
//     const connectedLinks = graph.getConnectedLinks(element)
//     return connectedLinks.find(link => link.attributes.target.port === id)
// }
//
// export function removeLinks(links) {
//     return links.forEach(link => link.remove())
// }
//
// // create list of links
// export function createLinks(sourceShape, targetShape, source2TargetInstance, graph) {
//     let links = []
//     source2TargetInstance.map(linkInstance => {
//         const link = new Link({
//             source: { id: sourceShape.id, port: linkInstance.source },
//             target: { id: targetShape.id, port: linkInstance.target },
//         })
//         links.push(link)
//         link.addTo(graph)
//     })
//
//     return links
// }
//
// // create hash links /// by target && by source ///
// export function createHashLinks(sourceShape, targetShape, source2TargetInstance) {
//     const bySource = {}
//     const byTarget = {}
//     source2TargetInstance.map(data => {
//         const link = new Link({
//             source: { id: sourceShape.id, port: data.source },
//             target: { id: targetShape.id, port: data.target },
//         })
//         bySource[data.source] = link
//         byTarget[data.target] = link
//     })
//     return {
//         bySource,
//         byTarget
//     }
// }
//
// export function removeSourceLinkByTargetPort(sourceView, targetPort) {
//     // remove the source link
//     const sourceLink = getLinkByTargetPort(sourceView, targetPort)
//     if (sourceLink && sourceLink.isLink()) {
//         sourceLink.remove();
//     } else {
//
//         console.error('NOT valid Link || no link found')
//     }
// }
//
// export function removeTargetLinkBySourcePort(sourceView, sourcePort) {
//     // remove the target link
//     const targetLink = getLinkBySourcePort(sourceView, sourcePort)
//     if (targetLink && targetLink.isLink()) {
//         targetLink.remove();
//     } else {
//
//         console.error('NOT valid Link || no link found')
//     }
// }
//
// export function createLink(graph, link, sourceShape, targetShape) {
//     const newLink = new Link({
//         source: { id: sourceShape.id, port: link.source },
//         target: { id: targetShape.id, port: link.target },
//     })
//     newLink.addTo(graph)
// }
//
// export function showLinkTools(linkView) {
//     let self = this
//     const tools = new dia.ToolsView({
//         tools: [
//             new TargetArrowhead(),
//             new Button({
//                 distance: '25%',
//                 action: function () {
//                     linkAction(this.model, linkView);
//                 }
//             })
//         ]
//     });
//     linkView.addTools(tools);
// }
//
// export function linkAction(link, linkView) {
//
//     const dialog = this.createDialog({
//         title: 'Confirmation',
//         content: `${i18n.methods.t('messages.deleteLink')}`,
//         buttons: ['cancel', 'remove']
//     })
//
//     dialog.open();
//     dialog.on({
//         'action:remove': function () {
//             //remove the target link
//             link.remove();
//             // remove the source link
//             removeTargetLinkBySourcePort(this.OutputRecord, link.attributes.target.port)
//
//             editObjectMapperRecord(link.attributes.target.port)
//
//             dialog.remove();
//         }.bind(this),
//         'action:cancel': function () {
//             dialog.remove();
//         }
//     })
// }
//
//
