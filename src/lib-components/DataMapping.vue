<template>
  <div class="canvas" ref="canvas"></div>
</template>

<script>

import { dia, elementTools, setTheme, shapes, ui, util } from '@OtailO-recommerce/rappid';
import { Link } from '../dataMappingLogic/shapes';
import { Decorator } from '../dataMappingLogic/highlighters';
import { Button, SourceArrowhead, TargetArrowhead } from '../dataMappingLogic/link-tools';
import { routerNamespace } from '../dataMappingLogic/routers';
import { anchorNamespace } from '../dataMappingLogic/anchors';
import { loadExample, records, links, hashLinks } from '../dataMappingLogic/example';
// import { dialog } from '../dataMappingLogic/utils';
import { chekLinksRules } from '../dataMappingLogic/recordsRules';
import { _replaceAll, cutStringFromSymbol } from '../utils/strings';
import i18n, { getLanguage } from '../services/i18n.vue.mixin';
import init, {
  objectMapperSchemaShape2Schema,
  transformJSON2Shape,
  objectMapperSchema2Shape,
  createObjectMapper2OutputInstance,
  createInput2ObjectMapperInstance,
  createLinks,
  createNewLinks, getValuesFromShape, createHashLinks
} from '../dataMappingLogic/init'


import Vue from 'vue';

export default Vue.extend({
  name: "DataMapping",

  props: {
    objectMapperSchema: {
      type: Object,
      required: true,
    },

    inputJson: {
      type: Object,
      required: true
    },

    outputJson: {
      type: Object,
      required: true
    },
    isLiveUpdate: {
      type: Boolean,
      default: true
    },
    lang: {
      type: String,
      default: 'en-US'
    },

  },

  data: () => ({
    $refs: {
      canvas: HTMLDivElement
    },

    graph: new dia.Graph({}, { cellNamespace: shapes }),
    paper: dia.Paper,
    scroller: ui.PaperScroller,
    toolbarHeight: 50,
    commandManager: dia.CommandManager
  }),
  methods: {
    createDialog(options) {
      const _createButtons = (buttons) => {
        const result = []
        buttons.forEach(button => {
          switch (button) {
            case 'cancel':
              result.push({
                content: `${i18n.methods.t('cancel')}`,
                action: 'cancel'
              })
              break
            case 'change':
              result.push({
                content: `<span style="color:#fe854f">${i18n.methods.t('change')}</span>`,
                action: 'change'
              })
              break
            case 'toggle':
              result.push({
                content: `<span style="color:#fe854f">${i18n.methods.t('toggle')}</span>`,
                action: 'toggle'
              })
              break
            case 'remove' :
              result.push({
                action: 'remove',
                content: `<span style="color:#fe854f">${i18n.methods.t('remove')}</span>`
              })
              break
            case 'confirm':
              result.push({
                content: `<span style="color:#fe854f">${i18n.methods.t('confirm')}</span>`,
                action: 'confirm'
              })
          }
        })
        return result
      }

      return new ui.Dialog({
        width: options.width || 300,
        title: options.title || 'Edit Item',
        closeButton: options.closeButton || false,
        content: options.content || 'Try this Dialog Test',
        buttons: _createButtons(options.buttons)
      })
    },

    showLinkTools(linkView) {
      let self = this
      const tools = new dia.ToolsView({
        tools: [
          new TargetArrowhead(),
          new Button({
            distance: '25%',
            action: function () {
              self.linkAction(this.model, linkView);
            }
          })
        ]
      });
      linkView.addTools(tools);
    },

    linkAction(link, linkView) {

      const dialog = this.createDialog({
        title: 'Confirmation',
        content: `${i18n.methods.t('messages.deleteLink')}`,
        buttons: ['cancel', 'remove']
      })

      dialog.open();
      dialog.on({
        'action:remove': function () {
          //remove the target link
          link.remove();
          // remove the source link
          this.removeTargetLinkBySourcePort(records.outputRecord, link.attributes.target.port)

          this.editObjectMapperRecord(link.attributes.target.port)

          dialog.remove();
        }.bind(this),
        'action:cancel': function () {
          dialog.remove();
        }
      })
    },

    getLinkBySourcePort(element, id) {
      const connectedLinks = this.graph.getConnectedLinks(element)
      return connectedLinks.find(link => link.attributes.source.port === id)
    },

    getLinkByTargetPort(element, id) {
      const connectedLinks = this.graph.getConnectedLinks(element)
      return connectedLinks.find(link => link.attributes.target.port === id)
    },

    // getTargetAndSourceLinks(element, id) {
    //   const result = {}
    //   const connectedLinks = this.graph.getConnectedLinks(element)
    //   connectedLinks.forEach(link => {
    //     if (link.attributes.target.port === id) result.target = link
    //     if (link.attributes.source.port === id) result.source = link
    //   })
    //   return result
    // },

    removeLinks(links) {
      return links.forEach(link => link.remove())
    },

    removeSourceLinkByTargetPort(sourceView, targetPort) {
      // remove the source link
      const sourceLink = this.getLinkByTargetPort(sourceView, targetPort)
      if (sourceLink && sourceLink.isLink()) {
        sourceLink.remove();
      } else {

        console.error('NOT valid Link || no link found')
      }
    },

    removeTargetLinkBySourcePort(sourceView, sourcePort) {
      // remove the target link
      const targetLink = this.getLinkBySourcePort(sourceView, sourcePort)
      if (targetLink && targetLink.isLink()) {
        targetLink.remove();
      } else {
        debugger
        console.error('NOT valid Link || no link found')
      }
    },

    showElementTools(elementView) {
      const element = elementView.model;
      const padding = util.normalizeSides(element.get('padding'));
      const isScrollable = (element.get('type') === 'mapping.Record');
      const transform = new ui.FreeTransform({
        cellView: elementView,
        allowRotation: false,
        resizeDirections: (isScrollable)
            ? ['top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left']
            : ['left', 'right'],
        minWidth: function () {
          return element.getMinimalSize().width;
        },
        minHeight: (isScrollable)
            ? padding.top + padding.bottom
            : 0
      });
      transform.render();
    },

    itemActionPicker(target, elementView, itemId, tools) {

      const element = elementView.model;
      const toolbar = new ui.ContextToolbar({
        target: target,
        padding: 5,
        vertical: true,
        tools: tools
      });

      toolbar.render();
      toolbar.on({
        'action:remove': function () {
          element.startBatch('item-remove');
          element.removeItem(itemId);
          element.removeInvalidLinks();
          element.stopBatch('item-remove');
          toolbar.remove();
        },
        'action:edit': function () {
          toolbar.remove();
          this.itemEditAction(element, itemId);
        }.bind(this),
        'action:add-child': function () {
          toolbar.remove();
          element.addItemAtIndex(itemId, Infinity, element.getDefaultItem());
          if (element.isItemCollapsed(itemId))
            element.toggleItemCollapse(itemId);
        },
        'action:add-next-sibling': function () {
          toolbar.remove();
          element.addNextSibling(itemId, element.getDefaultItem(itemId, element));
        },
        'action:add-prev-sibling': function () {
          toolbar.remove();
          element.addPrevSibling(itemId, element.getDefaultItem());
        },
        'action:edit-decorator': function () {
          toolbar.remove();
          this.itemDecoratorEditAction(element, itemId);
        }.bind(this)
      });
    },

    elementActionPicker(target, elementView, tools) {

      const element = elementView.model;
      const toolbar = new ui.ContextToolbar({
        target: target.firstChild,
        padding: 5,
        vertical: true,
        tools: tools
      });

      toolbar.render();
      toolbar.on({
        'action:remove': function () {
          toolbar.remove();
          element.remove();
        },
        'action:add-item': function () {
          toolbar.remove();
          element.addItemAtIndex(0, Infinity, element.getDefaultItem());
        }
      });
    },

    itemDecoratorEditAction(element, itemId) {
      const config = { [itemId]: { type: 'content-editable', label: 'Decorator' } };
      const path = ['decorators'];
      this.itemAction(element, config, path);
    },

    itemEditAction(element, itemId) {
      let config = null
      if (element.id === records.ObjectMapperRecord.id) {
        config = element.getObjectMapperInspectorConfig(itemId);
      } else {
        config = element.getJSONInspectorConfig(itemId);
      }

      const path = element.getItemPathArray(itemId);
      this.itemAction(element, config, path);
    },

    itemAction(element, config, itemPath) {

      if (!config || !itemPath) return;

      const inspector = new ui.Inspector({
        cell: element,
        live: false,
        inputs: util.setByPath({}, itemPath, config)
      });
      inspector.render();
      inspector.el.style.position = 'relative';
      inspector.el.style.overflow = 'hidden';
      const dialog = this.createDialog({
        width: 300,
        title: 'Edit Item',
        closeButton: true,
        content: inspector.el,
        buttons: ['cancel', 'change']
      });

      dialog.open();
      dialog.on({
        'action:cancel': function () {
          inspector.remove();
          dialog.close();
        }.bind(this),
        'action:change': function () {
          const prevItem = this.getItemByPath(element.attributes.items, [...itemPath])
          inspector.updateCell();
          const item = this.getItemByPath(element.attributes.items, [...itemPath])
          console.log(item)
          if (prevItem.label !== item.label) {
            item.id = element.getNewItemId(item.id, item.label)
            element.item(prevItem.id, item)
            debugger
          }
          if (!item.hasDefault) {
            item._default = undefined
            element.item(item.id, item)
          }

          const targetLink = this.getLinkByTargetPort(records.ObjectMapperRecord, item.id)
          const sourceLink = this.getLinkBySourcePort(records.ObjectMapperRecord, item.id)
          console.log(prevItem)
          console.log(sourceLink)
          if (!item._path) {
            if (targetLink
                && sourceLink
                && targetLink.isLink()
                && sourceLink.isLink()) {

              targetLink.remove()
              sourceLink.remove()
            }
          }
          if (item._path
              && targetLink
              && targetLink.isLink()
              && item._path !== prevItem._path) {

            targetLink.remove()

          }
          this.liveUpdateSchema()
          inspector.remove();
          dialog.close();
        }.bind(this)
      });

      const input = inspector.el.querySelector('[contenteditable]');
      if (input) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(input);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    },

    getItemByPath(items, path) {
      const item = items
      if (path.length <= 1) {
        return item
      }
      path.shift()
      return this.getItemByPath(items[path[0]], path)
    },

    findRecord(id) {
      return records.list.findIndex(record => record.id === id)
    },

    createLink(graph, link, sourceShape, targetShape) {
      const newLink = new Link({
        source: { id: sourceShape.id, port: link.source },
        target: { id: targetShape.id, port: link.target },
      })
      newLink.addTo(graph)
    },

    editRecord(element, linkView, itemId, updateData, eventName) {
      if (!itemId) return;
      const item = element.item(itemId)

      if (eventName === 'connect') {
        if (item._path) {
          const inspector = new ui.Inspector({
            cell: element,
            live: false,
          });
          inspector.render();
          inspector.el.style.position = 'relative';
          inspector.el.style.overflow = 'hidden';

          const dialog = this.createDialog({
            width: 300,
            title: 'Confirmation',
            closeButton: false,
            content: `${i18n.methods.t('messages.replaceLink')}`,
            buttons: ['cancel', 'confirm']
          });

          dialog.open();
          dialog.on({
            'action:cancel': function () {
              this.commandManager.undo()
              inspector.remove();
              dialog.close();
            }.bind(this),
            'action:confirm': function () {
              this.removeSourceLinkByTargetPort(linkView.sourceView.model, itemId)
              this.editObjectMapperRecord(itemId, updateData)
              inspector.remove();
              dialog.close();
            }.bind(this)
          });
        } else {
          // if no _path
          const link = {
            source: itemId,
            target: cutStringFromSymbol(itemId, '.')

          }
          this.createLink(this.graph, link, records.ObjectMapperRecord, records.outputRecord)
          this.editObjectMapperRecord(itemId, updateData)
        }
        // if eventName === disconnect
      } else {
        this.removeTargetLinkBySourcePort(element, itemId)
        updateData = this.updateProperties(updateData, item)
        element.item(itemId, updateData) // change the shape
      }
    },

    updateProperties(updateData, item) {
      for (const key in updateData) {
        if (!updateData[key]) {
          item[key] = undefined
        } else {
          item[key] = updateData[key]
        }
      }
      return item
    },

    updateItem(element, itemId, updateData) {
      if (updateData) {
        element.item(itemId, updateData) // change the shape
      }

      if (element.id === records.ObjectMapperRecord.id) {
        this.liveUpdateSchema()
      }
    },

    editObjectMapperRecord(targetId, updateData) {
      let ObjectMapperRecord = records.ObjectMapperRecord

      const item = ObjectMapperRecord.item(targetId)

      updateData ? this.updateProperties(updateData, item) : item._path = undefined

      this.updateItem(ObjectMapperRecord, targetId, item)
    },

    liveUpdateSchema() {
      if (!this.isLiveUpdate) return
      const schema = objectMapperSchemaShape2Schema(records.ObjectMapperRecord.attributes.items[0][0])

      this.$emit('mapObject', {
        schema: schema.$root,
        input: this.inputJson,
      })
    },

    start(objectMapperSchema, inputJson, outputJson) {
      setTheme('material');

      const graph = this.graph

      const paper = new dia.Paper({
        model: graph,
        width: 1200,
        height: 800,
        gridSize: 10,
        multiLinks: false,
        async: true,
        frozen: true,
        sorting: dia.Paper.sorting.APPROX,
        cellViewNamespace: shapes,
        // background: { color: '#fffff' },
        magnetThreshold: 'onleave',
        moveThreshold: 5,
        clickThreshold: 5,
        linkPinning: false,
        interactive: {
          linkMove: false,
          elementMove: false
        },
        markAvailable: true,
        snapLinks: { radius: 40 },
        routerNamespace: routerNamespace,
        defaultRouter: {
          name: 'mapping',
          args: { padding: 30 }
        },
        defaultConnectionPoint: { name: 'anchor' },
        anchorNamespace: anchorNamespace,
        defaultAnchor: { name: 'mapping' },
        defaultConnector: {
          name: 'jumpover',
          args: { jump: 'cubic' }
        },
        highlighting: {
          magnetAvailability: {
            name: 'addClass',
            options: {
              className: 'record-item-available'
            }
          },
          connecting: {
            name: 'stroke',
            options: {
              padding: 8,
              attrs: {
                'stroke': 'none',
                'fill': '#7c68fc',
                'fill-opacity': 0.2
              }
            }
          }
        },
        defaultLink: function () {
          return new Link();
        },
        validateConnection: function (sv, sm, tv, tm, end) {
          const svModel = sv.model;
          const tvModel = tv.model;
          if (sv === tv)
            return false;
          if (svModel.isLink() || tvModel.isLink())
            return false;
          if (end === 'target') {
            const targetItemId = tv.findAttribute('item-id', tm);
            if (!tvModel.isItemInView(targetItemId))
              return false;
            return (tvModel.getItemSide(targetItemId) !== 'right');
          }
          const sourceItemId = sv.findAttribute('item-id', sm);
          if (!svModel.isItemInView(sourceItemId))
            return false;
          return (svModel.getItemSide(sourceItemId) !== 'left');
        }
      });

      paper.options.allowLink = (linkView, paper) => {
        const validation = chekLinksRules('link:connect', linkView, paper.model)
        return validation.isValid
      }

      const scroller = new ui.PaperScroller({
        paper,
        cursor: 'grab',
        baseWidth: 1000,
        baseHeight: 1000,
        inertia: { friction: 0.8 },
        borderless: true
      });

      scroller.render()
      // Undo / Redo
      const commandManager = new dia.CommandManager({
        graph: graph,
        cmdBeforeAdd: function (eventName) {
          if (eventName === 'change:scrollTop')
            return false;
          return true;
        }
      });

      this.commandManager = commandManager


      // Scrollbars
      graph.on('add', (cell) => {
        if (cell.get('type') === 'mapping.Record') {
          cell.findView(paper).addTools(new dia.ToolsView({
            tools: [new elementTools.RecordScrollbar({})]
          }));
        }
      });
      // Decorators
      graph.on('add change:decorators', (cell) => {
        const decorators = cell.get('decorators');
        if (!util.isPlainObject(decorators))
          return;
        const view = cell.findView(paper);
        Decorator.remove(view);
        Object.keys(decorators).forEach(itemId => {
          const text = decorators[itemId];
          if (!text || !cell.item(itemId))
            return;
          Decorator.create(view, itemId, { text });
        });
      });

      commandManager.stopListening();

      const {
        inputShape,
        objectMapperShape,
        outputShape,
        objectMapperToOutput,
        inputToObjectMapper
      } = init(objectMapperSchema, inputJson, outputJson)

      loadExample(graph, { inputShape, objectMapperShape, outputShape }, { objectMapperToOutput, inputToObjectMapper })

      commandManager.listen();

      function zoom(x, y, delta) {
        scroller.zoom(delta * 0.2, { min: 0.4, max: 3, grid: 0.2, ox: x, oy: y });
      }

      paper.on('blank:pointerdown', (evt) => scroller.startPanning(evt));

      paper.on('blank:mousewheel', (evt, ox, oy, delta) => {
        evt.preventDefault();
        zoom(ox, oy, delta);
      });

      paper.on('link:mousewheel', (_, evt, ox, oy, delta) => {
        evt.preventDefault();
        zoom(ox, oy, delta);
      });

      paper.on('link:connect', (linkView, evt, elementViewConnected, magnet, arrowhead) => {
        const element = elementViewConnected.model;
        const link = linkView.model
        const validation = chekLinksRules('link:connect', linkView, element, arrowhead)
        if (!validation.isValid) {
          return
        }
        let sourceId = linkView.model.attributes.source.port
        const itemId = elementViewConnected.findAttribute('item-id', magnet)
        sourceId = _replaceAll(sourceId, "[0]", "[*]")
        evt.stopPropagation();

        const updateData = {
          _path: '.' + sourceId
        }
        const eventName = 'connect'

        this.editRecord(element, linkView, itemId, updateData, eventName);
      });

      paper.on('link:disconnect', (linkView, evt, elementViewDisconnected, magnet, arrowhead) => {
        const element = elementViewDisconnected.model;

        const validation = chekLinksRules('link:disconnect', linkView, element, arrowhead)
        if (!validation.isValid) {
          return
        }
        const itemId = elementViewDisconnected.findAttribute('item-id', magnet)

        const updateData = {
          _path: ''
        }

        const eventName = 'disconnect'

        this.editRecord(element, linkView, itemId, updateData, eventName)
      });

      paper.on('link:pointerclick', (linkView, evt, elementView, magnet, arrowhead) => {
        const validation = chekLinksRules('link:pointerclick', linkView)
        if (!validation.isValid) {
          return
        }
        this.showLinkTools(linkView);
      });

      paper.on('link:mouseenter', (linkView, evt, elementView, magnet, arrowhead) => {
        const validation = chekLinksRules('link:mouseenter', linkView, evt, elementView, magnet, arrowhead)
        if (!validation.isValid) {
          return
        }
        this.showLinkTools(linkView);
      });

      paper.on('link:mouseleave', (linkView) => {
        // const validation = chekLinksRules('link:mouseleave', linkView)
        // if (!validation.isValid) {
        //   return
        // }
        linkView.removeTools();
      });

      paper.on('element:magnet:pointerdblclick', (elementView, evt, magnet) => {
        if (elementView.model.id === records.outputRecord.id) {
          return
        }
        evt.stopPropagation();
        const model = elementView.model;
        this.itemEditAction(model, elementView.findAttribute('item-id', magnet));
      });

      paper.on('element:contextmenu', (elementView, evt) => {
        const model = elementView.model;
        const tools = model.getTools();
        if (tools) {
          evt.stopPropagation();
          this.elementActionPicker(elementView.el, elementView, tools);
        }
      });

      paper.on('element:magnet:contextmenu', (elementView, evt, magnet) => {
        const model = elementView.model;
        const itemId = elementView.findAttribute('item-id', magnet);
        const tools = model.getItemTools(itemId);
        if (tools) {
          evt.stopPropagation();
          this.itemActionPicker(magnet, elementView, elementView.findAttribute('item-id', magnet), tools);
        }
      });

      paper.on('element:pointerclick', (elementView) => {
        this.showElementTools(elementView);
      });

      paper.on('element:pointermove', function (view, evt, x, y) {
        const data = evt.data;
        let ghost = data.ghost;
        if (!ghost) {
          const position = view.model.position();
          ghost = view.vel.clone();
          ghost.attr('opacity', 0.3);
          ghost.appendTo(this.viewport);
          evt.data.ghost = ghost;
          evt.data.dx = x - position.x;
          evt.data.dy = y - position.y;
        }
        ghost.attr('transform', 'translate(' + [x - data.dx, y - data.dy] + ')');
      });

      paper.on('element:pointerup', (view, evt, x, y) => {
        const data = evt.data;
        if (data.ghost) {
          data.ghost.remove();
          view.model.position(x - data.dx, y - data.dy);
        }
      });

      paper.on('element:mousewheel', (recordView, evt, x, y, delta) => {
        evt.preventDefault();
        const record = recordView.model;
        if (!record.isEveryItemInView()) {
          record.setScrollTop(record.getScrollTop() + delta * 10);
        }
      });

      paper.on('element:decorator:pointerdown', (recordView, evt, itemId) => {
        const record = recordView.model;
        this.itemDecoratorEditAction(record, itemId);
      });


      // const isFrozen = paper.isFrozen()
      paper.unfreeze();

      this.scroller = scroller
      this.paper = paper
      // this.isValidLinks(inputToObjectMapper, objectMapperToOutput)
    },

  },

  created() {
    getLanguage(this.lang)
    this.start(this.objectMapperSchema, this.inputJson, this.outputJson)
  },

  mounted() {

    const { scroller, paper, $refs: { canvas } } = this;
    canvas.appendChild(this.scroller.el);

    scroller.center();
    paper.unfreeze();
  },

  watch: {
    inputJson(newData, oldData) {
      const inputRecord = records.InputRecord

      const newInputRecordItems = transformJSON2Shape(newData)
      const oldInputRecordItems = inputRecord.attributes.items[0]

      inputRecord.recordUpdate(oldInputRecordItems, newInputRecordItems)

      const schema = objectMapperSchemaShape2Schema(records.ObjectMapperRecord.attributes.items[0][0])

      this.$emit('mapObject', {
        schema: schema.$root,
        input: newData,
      })
    },

    objectMapperSchema(newData, oldData) {
      console.log('newData ===> ', newData)
      console.log('oldData ===> ', oldData)

      const objectMapperRecord = records.ObjectMapperRecord
      objectMapperRecord.recordUpdate(objectMapperRecord.attributes.items[0], [objectMapperSchema2Shape(newData)])

      const inputRecord = records.InputRecord
      objectMapperRecord.recordUpdate(inputRecord.attributes.items[0], [objectMapperSchema2Shape(newData)])

      // the new objectMapper record
      let newObjectMapperSchemaItems = objectMapperRecord.attributes.items[0]
      const Input2ObjectMapper = createInput2ObjectMapperInstance(newObjectMapperSchemaItems, records.InputRecord.attributes.items[0])

      this.graph.removeLinks(records.InputRecord)

      createLinks(records.InputRecord, objectMapperRecord, Input2ObjectMapper)
          .forEach(link => {
            link.addTo(this.graph)
          })
    },

    outputJson(newData, oldData) {

      const outputRecord = records.outputRecord

      const newOutputRecordItems = transformJSON2Shape(newData)
      const oldOutputRecordItems = outputRecord.attributes.items[0]

      outputRecord.recordUpdate(oldOutputRecordItems, newOutputRecordItems)
      const objectMapper2Output = createObjectMapper2OutputInstance(records.ObjectMapperRecord.attributes.items[0], newOutputRecordItems)

      this.graph.removeLinks(records.outputRecord)

      createLinks(records.ObjectMapperRecord, outputRecord, objectMapper2Output)
          .forEach(link => {
            link.addTo(this.graph)
          })
    },

    lang(newData, oldData) {

    },
    immediate: true,
    deep: true
  },
})
</script>

<style lang="scss">
@import "~@OtailO-recommerce/rappid/rappid.css";
@import '../dataMappingLogic/styles.scss';

.canvas {
  width: 95vw;
  height: 80vh;

  .joint-paper {
    border: 1px solid #A0A0A0;
  }
}

</style>
