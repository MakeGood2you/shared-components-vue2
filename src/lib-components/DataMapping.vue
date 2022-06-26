<template>
  <div class="canvas" ref="canvas">

  </div>
</template>

<script>

import { dia, elementTools, setTheme, shapes, ui, util } from '@OtailO-recommerce/rappid';

import { InputRecord, Link, ObjectMapperRecord, OutputRecord } from '../dataMappingLogic/shapes';
import { Decorator } from '../dataMappingLogic/highlighters';
import { Button, TargetArrowhead } from '../dataMappingLogic/link-tools';
import { routerNamespace } from '../dataMappingLogic/routers';
import { anchorNamespace } from '../dataMappingLogic/anchors';

import { createInspector, createDialog, } from '../dataMappingLogic/UI-utils';
import { cutStringFromSymbol } from '../utils/strings';

import i18n, { getLanguage } from '../services/i18n.vue.mixin';
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

    error: {
      type: Error,
      default: undefined,
    },
    allowedOMTools: {
      type: Array,
      default: () => ['export-to-json', 'edit', 'add-next-sibling', 'add-prev-sibling', 'remove', 'add-child', 'edit-function'],
    }
  },

  data: () => ({
    $refs: {
      canvas: HTMLDivElement
    },

    graph: new dia.Graph({}, { cellNamespace: shapes }),
    paper: null,
    scroller: null,
    toolbar: null,
    toolbarHeight: 40,
    commandManager: null,

    //Records instance
    InputRecord: {},
    OutputRecord: {},
    ObjectMapperRecord: {},

    //ALL Links in graph
    links: [],
    tempData: {
      itemId: null
    },


  }),
  methods: {
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
          element.removeItemAndInstances(itemId, this.OutputRecord)
          this.removeDecorator(element, itemId)
          toolbar.remove();
          this.liveUpdateSchema()
        }.bind(this),
        'action:edit': function () {
          toolbar.remove();
          this.itemEditAction(element, itemId);
        }.bind(this),
        'action:add-child': function () {
          toolbar.remove();

          const parent = element.item(itemId)
          if (!['Array', 'Object'].includes(parent._type)) {
            const dialog = createDialog({
              title: 'Error',
              closeButton: true,
              content: 'This Item not From type Array or Object',
              buttons: ['cancel']
            })
            dialog.open()
            dialog.on({
              'action:cancel': function () {
                dialog.remove();
              }.bind(this),
            })
            return
          }
          const child = element.getDefaultChild(itemId, element, 'document')
          element.addItemAtIndex(itemId, Infinity, child);

          this.itemEditAction(element, child.id)
          if (element.isItemCollapsed(itemId))
            element.toggleItemCollapse(itemId);
          this.liveUpdateSchema()
        }.bind(this),

        'action:add-next-sibling':
            function () {
              toolbar.remove();
              element.addNextSibling(itemId, element.getDefaultItem(itemId, element));
              this.liveUpdateSchema()
            }.bind(this),

        'action:add-prev-sibling':
            function () {
              toolbar.remove();
              element.addPrevSibling(itemId, element.getDefaultItem(itemId, element));
              this.liveUpdateSchema()
            }.bind(this),

        'action:edit-function':
            function () {
              toolbar.remove();
              this.editUserFunctionAction(element, itemId);
            }.bind(this),
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
        'action:export-to-json': function () {
          toolbar.remove();
          this.copyRecordJSON({ element, ObjectMapperRecord: this.ObjectMapperRecord })
        }.bind(this),
        'action:import-json': function () {
          toolbar.remove();
          this.importJSONToElementAction(element, '$_root')
        }.bind(this)
      });
    },

    copyRecordJSON(opt) {
      let copiedText = null
      if (opt.element.id !== this.ObjectMapperRecord.id) {
        copiedText = opt.element.transformShape2JSON()
      } else {
        copiedText = this.ObjectMapperRecord.objectMapperSchemaShape2Schema()
      }
      this.doCopy(JSON.stringify(copiedText))
    },

    doCopy(copiedText) {
      navigator.clipboard.writeText(copiedText).then((e) => {
        /* Resolved - text copied to clipboard */
        console.info('Copied!')
      }, (e) => {
        console.info('Failed to Copied!')
      });
    },

    editUserFunctionAction(element, itemId) {
      const config = { _transformerCode: { type: 'content-editable', label: 'Transformer Code' } };
      const path = element.getItemPathArray(itemId);
      this.itemAction(element, config, path, itemId, 'user-function');
    },

    importJSONToElementAction(element, itemId) {
      const config = { schema: { type: 'content-editable', label: 'Object schema' } };
      const path = element.getItemPathArray('$_root');

      this.itemAction(element, config, path, itemId, 'import-JSON-to-element');
    },

    itemEditAction(element, itemId) {
      let config = element.getInspectorConfig(itemId);
      const path = element.getItemPathArray(itemId);
      this.itemAction(element, config, path, itemId, 'item');
    },

    // type is reqarie
    itemAction(element, config, itemPath, itemId, type) {

      if (!config || !itemPath) return;

      const inspector = createInspector(element, itemPath, config)

      inspector.render();
      inspector.el.style.position = 'relative';
      inspector.el.style.overflow = 'hidden';

      const dialog = createDialog({
        width: 300,
        title: 'Edit Item',
        closeButton: false,
        content: inspector.el,
        buttons: ['cancel', 'change']
      });

      dialog.open();

      dialog.on({
        'action:cancel': function () {
          if (type === 'user-function') {
            this.setPrevValidUserFunction(itemId)
          }
          inspector.remove();
          dialog.close();
        }.bind(this),
        'action:change': function () {
          const prevItem = element.getItemByPath(element.attributes.items, [...itemPath])
          inspector.updateCell()
          //chose action target
          this.actionType(type, element, itemPath, itemId, prevItem, inspector)

          // save the item id in memory if error will appear
          // (we listen to error prop in watch)
          // and remove in function setPrevValidUserFunction
          if (type === 'user-function') this.tempData.itemId = itemId
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

    //save the valid prev _transformerCode in _prevValidTransformerCode in same cell
    savePrevValidUserFunction(itemId) {
      if (itemId === '$_root') return
      const item = this.ObjectMapperRecord.item(itemId)
      if (item && ![null, undefined, ''].includes(item._transformerCode)) {
        item._prevValidTransformerCode = item._transformerCode
        this.ObjectMapperRecord.item(itemId, item)
      }
    },

    //set the valid prev _prevValidTransformerCode in _transformerCode in same cell
    setPrevValidUserFunction(itemId) {
      const item = this.ObjectMapperRecord.item(itemId)

      const value = item._prevValidTransformerCode || ''

      const newItem = { _transformerCode: value }

      const result = this.ObjectMapperRecord.item(itemId, newItem) //set the prev valid _transformerCode

      if (value === '') this.removeDecorator(this.ObjectMapperRecord, itemId)

      delete this.tempData.itemId
    },

    renderDecorators(element) {
      const decorators = element.get('decorators');
      if (!util.isPlainObject(decorators))
        return;
      const view = element.findView(this.paper);
      Decorator.remove(view);
      Object.keys(decorators).forEach(itemId => {
        const text = decorators[itemId];
        if (!text || !element.item(itemId))
          return;
        Decorator.create(view, itemId, { text });
      });
    },

    addDecorator(element, itemId) {
      const decorators = element.get('decorators');
      if (!decorators) {
        element.set('decorators', { [itemId]: 'f()' });
      } else if (!decorators[itemId]) {
        decorators[itemId] = 'f()'
        element.set('decorators', decorators);
      } else return ''
      this.renderDecorators(element)
    },

    removeDecorator(element, itemId) {
      if (element.attributes.decorators && element.attributes.decorators[itemId]) {
        delete element.attributes.decorators[itemId]
        this.renderDecorators(element)
      }
    },

    actionType(type, element, itemPath, itemId, prevItem, inspector) {

      switch (type) {
        case 'user-function':
          const inputText = inspector.el.querySelector('[contenteditable]').innerText;
          if (['', undefined, null].includes(inputText)) {
            this.removeDecorator(element, itemId)
          } else
            this.addDecorator(element, itemId)
          this.liveUpdateSchema()
          break

        case 'item':
          const item = element.getItemByPath(element.attributes.items, [...itemPath])
          if (element.id === this.InputRecord.id) {
            const result = {
              label: item.key + ': ' + item.value
            }
            element.item(itemId, result)
            break;
          }

          if (prevItem._type !== item._type) {
            switch (item._type) {
              case 'Leaf':
                if (['Array', 'Object'].includes(prevItem._type)) {
                  if (prevItem.items.length > 0) {
                    let dialog = createDialog({
                      // title: i18n.methods.t('issue'),
                      title: 'Confirmation',
                      closeButton: true,
                      content: 'Are you sure you want delete all children of this Node?',
                      buttons: ['cancel', 'confirm']
                    })
                    dialog.open()
                    dialog.on({
                      'action:cancel': function () {
                        element.item(itemId, { ...prevItem })
                        dialog.close();
                      },
                      'action:confirm': function () {

                        console.log(item)
                        element.item(itemId, {
                          ...item,
                          items: [],
                          icon: 'mapper/document.svg',
                        })

                        dialog.close();
                      }
                    })
                  } else {
                    console.log('else if items is empty its can be change')
                  }
                  return
                } else {
                  console.log('else is pass to make change on type')
                }
                console.log('Leaf ==>', item._type)
                break;

              case 'Array':
              case 'Object':
                if (prevItem._type !== 'Leaf') {
                  element.item(itemId, { ...prevItem })
                  let dialog = createDialog({
                    // title: i18n.methods.t('issue'),
                    title: 'issue',
                    closeButton: true,
                    content: 'you can change type only to leaf',
                    buttons: ['ok']
                  })
                  dialog.open()
                  dialog.on({
                    'action:ok': function () {
                      dialog.close();
                    }
                  })
                  return
                } else {
                  console.log('else is pass to make change on type')
                }
                break;
            }
          }

          if (prevItem.label !== item.label) {
            item.id = element.getNewItemId(item.id, item.label)
            element.item(prevItem.id, item)
          }

          if (item.hasDefault) {
            item._default = item._default ? item._default : `""`
            element.item(item.id, item)
          } else {
            item._default = undefined
            element.item(item.id, item)
          }

          const targetLink = this.getLinkByTargetPort(this.ObjectMapperRecord, item.id)
          const sourceLink = this.getLinkBySourcePort(this.ObjectMapperRecord, item.id)

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
          break

        case 'import-JSON-to-element':
          const schema = JSON.parse(element.item('$_root').schema)
          this.liveUpdateSchema(schema)
          break
      }
    },

    // getItemByPath(items, path) {
//   const item = items
//   if (path.length <= 1) {
//     return item
//   }
//   path.shift()
//   return this.getItemByPath(items[path[0]], path)
// },

    editRecord(element, linkView, itemId, updateData, eventName) {
      if (!itemId) return;
      const item = element.item(itemId)

      if (eventName === 'connect') {
        if (item._path) {
          const inspector = createInspector(element)

          const dialog = createDialog({
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
          this.createLink(this.graph, link, this.ObjectMapperRecord, this.OutputRecord)
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

      if (element.id === this.ObjectMapperRecord.id) {
        this.liveUpdateSchema()
      }
    },

    editObjectMapperRecord(targetId, updateData) {
      let ObjectMapperRecord = this.ObjectMapperRecord

      const item = ObjectMapperRecord.item(targetId)

      updateData ? this.updateProperties(updateData, item) : item._path = undefined

      this.updateItem(ObjectMapperRecord, targetId, item)
    },

    liveUpdateSchema(schema) {
      if (!this.isLiveUpdate) return
      schema = schema ? schema : this.ObjectMapperRecord.objectMapperSchemaShape2Schema(this.ObjectMapperRecord.attributes.items[0][0]).$_root
      // schema = this.ObjectMapperRecord.objectMapperSchemaShape2Schema(this.ObjectMapperRecord.attributes.items[0][0])

      this.$emit('mapObject', {
        schema: schema,
        input: this.inputJson,
      })
    },

    // LINKS RULES
    checkLinksRules(eventName, linkView, element, arrowhead) {
      const checkRecordLinkConnection = (linkView, element, logs = []) => {
        const validation = { isValid: false, logs }

        const targetId = linkView.model.attributes.target.id
        const sourceId = linkView.model.attributes.source.id

        // input record
        // if target is inputRecord is not valid
        if (targetId === this.InputRecord.id) return validation
        // validation.logs.push(['Not Allowed to connect', ' element.id === records.InputRecord'])

        // output record
        // if target is outputRecord is not valid
        if (targetId === this.OutputRecord.id) return validation
        // validation.logs.push(['Not Allowed to connect', 'element.id === records.OutputRecord.id'])

        //object mapper record
        //if source is outputRecord is not valid
        if (sourceId === this.OutputRecord.id) return validation
        // validation.logs.push(['Not Allowed to connect', 'element.id === records.ObjectMapperRecord.id'])

        //object mapper record
        //if source is ObjectMapperRecord is not valid
        if (sourceId === this.ObjectMapperRecord.id) return validation
        // validation.logs.push(['Not Allowed to connect', ' element.id === records.ObjectMapperRecord.id'])

        if ((sourceId === this.ObjectMapperRecord.id) && (targetId === this.OutputRecord.id)) return validation
        // validation.logs.push(['Not Allowed to pass', 'linkView.model.attributes.target.id !== records.OutputRecord.id', 'linkView.model.attributes.source.id !== records.ObjectMapperRecord.id'])


        validation.isValid = true
        return validation
      }
      const checkRecordLinkDisconnect = (linkView, element, arrowhead, logs = []) => {
        const validation = { isValid: false, logs }
        if (arrowhead !== 'source') {
          validation.isValid = true
          return validation
        }

        if (element.id !== this.InputRecord.id) {
          validation.isValid = true
          return validation
        }

        if (linkView.model._previousAttributes.source.port !== linkView.model.attributes.source.port) {
          // validation.logs.push(['Not Allowed to pass', '_previousAttributes.source.port !== attributes.source.port',])
          validation.isValid = false
          return validation
        }
      }

      switch (eventName) {
        case 'link:mousewheel':
          return true

        case 'link:connect':
          return checkRecordLinkConnection(linkView, element, arrowhead)

        case 'link:disconnect':
          return checkRecordLinkDisconnect(linkView, element, arrowhead)

        case 'link:pointerclick':
          return checkRecordLinkConnection(linkView)

        case 'link:mouseenter':
          return checkRecordLinkConnection(linkView)

        case 'link:mouseleave':
          return true
      }
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

      const dialog = createDialog({
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
          this.removeLinks(link.attributes.target.port)
          this.removeTargetLinkBySourcePort(this.OutputRecord, link.attributes.target.port)

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

    findLinksById(id) {
      const foundLinks = []
      this.graph.getConnectedLinks(this.ObjectMapperRecord).forEach(link => {
        if (link.attributes.target.port === id) {
          foundLinks.push(link)
        }

        if (link.attributes.source.port === id) {
          foundLinks.push(link)
        }
      })
      return foundLinks
    },

    removeLinks(id) {
      this.findLinksById(id).forEach(link => link.remove())
    },

    // create list of links
    createLinks(sourceShape, targetShape, source2TargetInstance, isAddToGraph = false, linksTarget = undefined) {
      let links = []
      source2TargetInstance.map(linkInstance => {
        const link = new Link({
          source: { id: sourceShape.id, port: linkInstance.source },
          target: { id: targetShape.id, port: linkInstance.target },
        })
        links.push(link)
        if (isAddToGraph) link.addTo(this.graph)
      })

      return linksTarget ? links = links.concat(links, linksTarget) : links
    },

    createLink(graph, link, sourceShape, targetShape) {
      const newLink = new Link({
        source: { id: sourceShape.id, port: link.source },
        target: { id: targetShape.id, port: link.target },
      })
      newLink.addTo(graph)
    },

    // create hash links // ... // by target && by source ///
    createHashLinks(sourceShape, targetShape, source2TargetInstance) {
      const bySource = {}
      const byTarget = {}
      source2TargetInstance.map(data => {
        const link = new Link({
          source: { id: sourceShape.id, port: data.source },
          target: { id: targetShape.id, port: data.target },
        })
        bySource[data.source] = link
        byTarget[data.target] = link
      })
      return {
        bySource,
        byTarget
      }
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

        console.error('NOT valid Link || no link found')
      }
    },

    createRecords(graph, schema, actions) {
      schema = schema ? schema : this.objectMapperSchema

      this.InputRecord = new InputRecord([], this.inputJson)
          .setName(i18n.methods.t('inputName'))
          .position(100, 200)
          .addTo(graph)

      this.ObjectMapperRecord = new ObjectMapperRecord(
          this.allowedOMTools,
          schema)
          .setName(i18n.methods.t('mappingSchema'))
          .position(550, 100)
          .addTo(graph)

      this.OutputRecord = new OutputRecord([], this.outputJson)
          .setName(i18n.methods.t('outputName'))
          .position(900, 200)
          .addTo(graph)
    },

    createLinksInstance() {
      const input2ObjectMapper = this.ObjectMapperRecord.createInput2ObjectMapperInstance(this.ObjectMapperRecord.attributes.items[0], this.InputRecord.attributes.items[0])
      const objectMapper2Output = this.ObjectMapperRecord.createObjectMapper2OutputInstance(this.ObjectMapperRecord.attributes.items[0], this.OutputRecord.attributes.items[0])

      const objectMapper2OutputLinks = this.createLinks(this.ObjectMapperRecord, this.OutputRecord, objectMapper2Output, true)
      const input2ObjectMapperLinks = this.createLinks(this.InputRecord, this.ObjectMapperRecord, input2ObjectMapper, true)

      this.links = this.links.concat(objectMapper2OutputLinks, input2ObjectMapperLinks)
    },

    start() {
      setTheme('modern');

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
                'fill': '#8cc23d',
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
        const validation = this.checkLinksRules('link:connect', linkView, paper.model)
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
        cmdBeforeAdd: function (eventName, cell, graph, options) {
          if (eventName === 'change:scrollTop')
            return false;
          return true;
        }
      });
      //
      this.commandManager = commandManager

      //todo: Suspended because logic complicated we will take care of this later

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

      this.createRecords(graph)
      // Create the instance of links
      this.createLinksInstance()

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

        const eventName = 'connect'
        const element = elementViewConnected.model;
        const link = linkView.model
        const validation = this.checkLinksRules('link:connect', linkView, element, arrowhead)
        if (!validation.isValid) {
          return
        }
        let sourceId = cutStringFromSymbol(linkView.model.attributes.source.port, '].')// cut the end of index string to be equal to source id

        const itemId = elementViewConnected.findAttribute('item-id', magnet)
        // sourceId = _replaceAll(sourceId, "[0]", "[*]")
        evt.stopPropagation();

        const updateData = {
          _path: sourceId // absPath
        }

        this.editRecord(element, linkView, itemId, updateData, eventName);
        commandManager.storeBatchCommand()
      });

      paper.on('link:disconnect', (linkView, evt, elementViewDisconnected, magnet, arrowhead) => {

        const element = elementViewDisconnected.model;

        const validation = this.checkLinksRules('link:disconnect', linkView, element, arrowhead)
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
        const validation = this.checkLinksRules('link:pointerclick', linkView)
        if (!validation.isValid) {
          return
        }
        this.showLinkTools(linkView);
      });

      paper.on('link:mouseenter', (linkView, evt, elementView, magnet, arrowhead) => {
        const validation = this.checkLinksRules('link:mouseenter', linkView, evt, elementView, magnet, arrowhead)
        if (!validation.isValid) {
          return
        }
        this.showLinkTools(linkView);
      });

      paper.on('link:mouseleave', (linkView) => {
        // const validation = checkLinksRules('link:mouseleave', linkView)
        // if (!validation.isValid) {
        //   return
        // }
        linkView.removeTools();
      });

      paper.on('element:magnet:pointerdblclick', (elementView, evt, magnet) => {
        if (elementView.model.id === this.OutputRecord.id) {
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
        console.log('element:decorator:pointerdown')
        // this.itemDecoratorEditAction(record, itemId);
      });

      paper.unfreeze();

      this.scroller = scroller
      this.paper = paper
      this.toolbar = toolbar
    },
  },

  created() {
    getLanguage(this.lang)
    this.start()
  },

  mounted() {
    const { scroller, paper, $refs: { canvas } } = this;
    canvas.appendChild(this.scroller.el);
    // canvas.appendChild(this.toolbar.el);

    scroller.center();
    paper.unfreeze();
  },

  watch: {
    inputJson(newData, oldData) {
      const newInputRecord = new InputRecord([], newData)
      const newInputRecordItems = newInputRecord.attributes.items[0]
      const oldInputRecordItems = this.InputRecord.attributes.items[0]

      this.InputRecord.recordUpdate(oldInputRecordItems, newInputRecordItems)

      const schema = this.ObjectMapperRecord.objectMapperSchemaShape2Schema(this.ObjectMapperRecord.attributes.items[0][0])

      this.$emit('mapObject', {
        schema: schema.$_root,
        input: newData,
      })
      this.setHistoryOfCommandManager()
    },

    objectMapperSchema(newData, oldData) {
      if (!newData) return
      const newShape = new ObjectMapperRecord([], newData)

      this.ObjectMapperRecord.recordUpdate(this.ObjectMapperRecord.attributes.items[0], newShape.attributes.items[0])

      //save the valid prev _transformerCode
      this.savePrevValidUserFunction(this.tempData.itemId)


      // the new objectMapper record
      let newObjectMapperSchemaItems = this.ObjectMapperRecord.attributes.items[0]
      const Input2ObjectMapper = this.ObjectMapperRecord.createInput2ObjectMapperInstance(newObjectMapperSchemaItems, this.InputRecord.attributes.items[0])

      this.graph.removeLinks(this.InputRecord)

      this.createLinks(this.InputRecord, this.ObjectMapperRecord, Input2ObjectMapper, true)
    },

    outputJson(newData, oldData) {

      const newOutputRecord = new OutputRecord([], newData)
      const newOutputRecordItems = newOutputRecord.attributes.items[0]
      const oldOutputRecordItems = this.OutputRecord.attributes.items[0]

      this.OutputRecord.recordUpdate(oldOutputRecordItems, newOutputRecordItems)
      const objectMapper2Output = this.ObjectMapperRecord.createObjectMapper2OutputInstance(this.ObjectMapperRecord.attributes.items[0], newOutputRecordItems)

      this.graph.removeLinks(this.OutputRecord)

      this.createLinks(this.ObjectMapperRecord, this.OutputRecord, objectMapper2Output, true)

    },

    lang(newData, oldData) {

    },

    error(newData, oldData) {
      const dialog = createDialog({
        // width: options.width || 300,
        title: '<span style="color:#dc6a6a; font-weight: bold;">Error !</span>',
        closeButton: false,
        content: `Something went wrong.\n ${newData}`,
        buttons: ['ok']
      })
      dialog.open();

      dialog.on({
        'action:ok': function () {
          this.editUserFunctionAction(this.ObjectMapperRecord, this.tempData.itemId)
          dialog.close();
        }.bind(this),
      });

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

.joint-inspector.joint-theme-modern {
  background: #f6f6f6 !important;
  color: #000000 !important;
}

.joint-inspector.joint-theme-modern .toggle input:checked + span {
  background: #3eac49
}

.content-editable {
  color: #262c29 !important;
}

</style>
