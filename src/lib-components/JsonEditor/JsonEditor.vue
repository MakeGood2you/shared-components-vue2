<template>
  <div class="canvas" ref="canvas"></div>
</template>

<script>
import { routerNamespace } from '../DataMapping/dataMappingLogic/routers';
import { anchorNamespace } from '../DataMapping/dataMappingLogic/anchors';
import { dia, elementTools, setTheme, shapes, ui, util } from '@OtailO-recommerce/rappid';
import { InputRecord } from './jsonEditorLogic/shapes';
import i18n, { getLanguage } from '../../services/i18n.vue.mixin';
import { createDialog, createInspector } from '../../utils/jointJS-UI-utils';
import { textArea } from '../../utils/html-tamples';

export default {
  name: "JsonEditor",
  props: {
    inputJson: {
      type: [Object, Array],
      required: true,
      default: () => {
        return {
          "order_no": "ORD487",
          "creation_date": "2022-02-27",
          // "currency": "$",
          // "product_items": [
          //   {
          //     "product_id": 123123,
          //     "item_id": 231231,
          //     "quantity": 25,
          //     "c_otailoAttribtues": {
          //       "price": {
          //         "sales": {
          //           "value": 49.9
          //         },
          //         "list": {
          //           "value": 99.9
          //         }
          //       },
          //       "variationAttributes": [
          //         {
          //           "id": "size",
          //           "values": [
          //             {
          //               "selected": true,
          //               "displayValue": "small"
          //             },
          //             {
          //               "selected": false,
          //               "displayValue": "medium"
          //             },
          //             {
          //               "selected": false,
          //               "displayValue": "large"
          //             }
          //           ]
          //         },
          //         {
          //           "id": "color",
          //           "values": [
          //             {
          //               "selected": true,
          //               "displayValue": "red"
          //             },
          //             {
          //               "selected": false,
          //               "displayValue": "blue"
          //             },
          //             {
          //               "selected": false,
          //               "displayValue": "yellow"
          //             }
          //           ]
          //         }
          //       ],
          //       "images": {
          //         "small": [
          //           {
          //             "url": "https://imageUrlSmall.png"
          //           }
          //         ]
          //       }
          //     },
          //     "product_name": "Air max",
          //     "c_otailoTrackingID": "KLHKJ213L1JJ2K",
          //     "c_otailoTrackingURL": "https://www.makegood.co.il",
          //     "c_otailoReturnReason": "do now match to my legs",
          //     "c_otailoReturnType": "Object",
          //     "c_otailoStatus": "pending"
          //   },
          // ],
          // testObject: {
          //   "product_id": 123123,
          //   "item_id": 231231,
          //   "quantity": 25,
          //   "c_otailoAttribtues": {
          //     "price": {
          //       "sales": {
          //         "value": 49.9
          //       },
          //       "list": {
          //         "value": 99.9
          //       }
          //     },
          //     "variationAttributes": [
          //       {
          //         "id": "size",
          //         "values": [
          //           {
          //             "selected": true,
          //             "displayValue": "small"
          //           },
          //           {
          //             "selected": false,
          //             "displayValue": "medium"
          //           },
          //           {
          //             "selected": false,
          //             "displayValue": "large"
          //           }
          //         ]
          //       },
          //       {
          //         "id": "color",
          //         "values": [
          //           {
          //             "selected": true,
          //             "displayValue": "red"
          //           },
          //           {
          //             "selected": false,
          //             "displayValue": "blue"
          //           },
          //           {
          //             "selected": false,
          //             "displayValue": "yellow"
          //           }
          //         ]
          //       }
          //     ],
          //     "images": {
          //       "small": [
          //         {
          //           "url": "https://imageUrlSmall.png"
          //         }
          //       ]
          //     }
          //   },
          //   "product_name": "Air max",
          //   "c_otailoTrackingID": "KLHKJ213L1JJ2K",
          //   "c_otailoTrackingURL": "https://www.makegood.co.il",
          //   "c_otailoReturnReason": "do now match to my legs",
          //   "c_otailoReturnType": "Object",
          //   "c_otailoStatus": "pending"
          // },
        }
      },
    },

    isDone: {
      type: Boolean,
      default: false
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
      default: () => ['export-to-json', 'edit', 'add-next-sibling', 'add-prev-sibling', 'remove', 'add-child',],
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
    commandManager: null,

    //Records instance
    InputRecord: {},
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

    refreshRecord(element, newData) {
      newData = !newData ? element.transformShape2JSON(element.attributes.items[0]) : newData

      const oldInputRecordItems = element.attributes.items[0]
      const newInputRecord = new InputRecord([], newData)
      const newInputRecordItems = newInputRecord.attributes.items[0]

      element.recordUpdate(oldInputRecordItems, newInputRecordItems)
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

          const item = element.item(itemId)
          const parentId = element.getParentId(item.id)
          let parent = element.item(parentId)
          if (parent && parent._type === 'Array') {
            element.removeItem(item.id)
            this.refreshRecord(element)
          } else {
            element.removeItemAndInstances(itemId, element)
          }

          toolbar.remove();
        }.bind(this),

        'action:edit': function () {
          toolbar.remove();
          this.itemEditAction(element, itemId);
        }.bind(this),

        'action:add-child': function () {
          toolbar.remove();
          const parent = element.item(itemId)
          let newChild = {}
          if (parent && !['Array', 'Object'].includes(parent._type)) {
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

          newChild = element.getDefaultChild(parent.id)
          if (parent && parent._type === 'Array') {
            newChild = element.addItemInArray(parent, newChild)
            element.addItemAtIndex(itemId, Infinity, newChild);
            this.refreshRecord(element)
          } else {
            element.addItemAtIndex(itemId, Infinity, newChild);
          }

          if (element.isItemCollapsed(itemId))
            element.toggleItemCollapse(itemId);

        }.bind(this),

        'action:add-next-sibling': function () {
          const newItem = element.createSibling(itemId)
          element.addNextSibling(itemId, newItem);
          this.refreshRecord(element)
          toolbar.remove();

        }.bind(this),

        'action:add-prev-sibling': function () {
          const newItem = element.createSibling(itemId)
          element.addPrevSibling(itemId, newItem);
          this.refreshRecord(element)

          toolbar.remove();
        }.bind(this)
      });
    },

    onUpdateInput(input) {
      input = input ? input : this.InputRecord.transformShape2JSON(this.InputRecord.attributes.items[0])
      this.$emit('updateJsonInput', { input })
    },

    elementActionPicker(target, elementView, tools) {
      const self = this
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
          this.copyRecordJSON({ element: this.InputRecord })
        }.bind(this),

        'action:import-json': function () {
          toolbar.remove();
          let elTextarea = null

          const dialog = createDialog({
            width: 400,
            title: 'Edit Item',
            closeButton: false,
            content: textArea,
            buttons: ['cancel', 'change']
          });

          dialog.open();

          dialog.on({
            'action:cancel': function () {
              dialog.close();
            }.bind(this),
            'action:change': function () {
              elTextarea = document.getElementById('importJson')
              const value = elTextarea.value
              try {
                const input = JSON.parse(value)
                element.remove();
                self.createRecords(self.graph, input)
                dialog.close();
              } catch (err) {
                const dialog = createDialog({
                  width: 400,
                  title: 'Error',
                  closeButton: false,
                  content: 'Invalid input',
                  buttons: ['ok']
                });
                dialog.open();
                dialog.on({
                  'action:ok': function () {
                    dialog.close();
                  }.bind(this),
                })
              }

            }
          })

        }

      });
    },

    itemAction(element, config, itemPath, itemId, type) {

      if (!config || !itemPath) return;

      const inspector = createInspector(element, itemPath, config)

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
          inspector.remove();
          dialog.close();
        }.bind(this),
        'action:change': function () {
          const prevItem = element.item(itemId)
          // update the new data in input to json
          inspector.updateCell()

          const currItem = element.item(itemId)
          let newItem = null

          if (prevItem._type !== currItem._type) {
            newItem = element.updateTypeOfNode(prevItem, currItem, itemId)

            // if currItem type has been changed
            // we get the new updated object
            if (currItem._type !== 'Leaf') {
              newItem = element.item(currItem.id)
            }
          }

          // if true we push the newItem
          // else we send the currItem
          newItem = newItem
              ? element.updateLabel(newItem)
              : element.updateLabel(currItem)


          element.item(prevItem.id, newItem)
          this.refreshRecord()
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

    itemEditAction(element, itemId) {
      const parentId = element.getParentId(itemId)
      const parent = element.item(parentId);
      let config = element.getInspectorConfig(itemId);

      if (parent && parent._type === 'Array') {
        debugger
        config.key.readonly = true
        config = structuredClone(config)
      }

      const path = element.getItemPathArray(itemId);
      this.itemAction(element, config, path, itemId, 'item');
    },

    start(input) {
      setTheme('modern');

      const graph = this.graph

      const paper = new dia.Paper({
        model: graph,
        width: window.screen.width,
        height: window.screen.height,
        gridSize: 10,
        multiLinks: false,
        async: true,
        frozen: true,
        sorting: dia.Paper.sorting.APPROX,
        cellViewNamespace: shapes,
        background: { color: '#fffff' },
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

      });

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

      commandManager.stopListening();

      this.createRecords(graph, input)

      commandManager.listen();

      paper.on('blank:pointerdown', (evt) => scroller.startPanning(evt));

      // paper.on('blank:mousewheel', (evt, ox, oy, delta) => {
      //   evt.preventDefault();
      //   zoom(ox, oy, delta);
      // });

      paper.on('element:magnet:pointerdblclick', (elementView, evt, magnet) => {

        evt.stopPropagation();
        const model = elementView.model;
        const itemId = elementView.findAttribute('item-id', magnet);
        debugger
        this.itemEditAction(model, itemId);
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

      paper.unfreeze();

      this.scroller = scroller
      this.paper = paper
      this.toolbar = toolbar
    },

    createRecords(graph, _inputJson) {
      this.InputRecord = new InputRecord(this.allowedOMTools, _inputJson || this.inputJson)
          .setName(i18n.methods.t('inputName'))
          .position(window.screen.width * 0.30, window.screen.height / 10)
          .addTo(graph)
    },

    copyRecordJSON(opt) {
      let copiedText = JSON.stringify(opt.element.transformShape2JSON(this.InputRecord.attributes.items[0]))
      navigator.clipboard.writeText(copiedText).then((e) => {
        /* Resolved - text copied to clipboard */
        console.info('Copied!')
      }, (e) => {
        console.info('Failed to Copied!')
      });
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
    this.$emit('isLoaded')
  },

  watch: {
    inputJson(newData, oldData) {
      // const newInputRecord = new InputRecord([], newData)
      // const newInputRecordItems = newInputRecord.attributes.items[0]
      // const oldInputRecordItems = this.InputRecord.attributes.items[0]
      //
      // this.InputRecord.recordUpdate(oldInputRecordItems, newInputRecordItems)
    },

    isDone(newData, oldData) {
      if (!newData) return
      this.onUpdateInput()
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
          // this.editUserFunctionAction(this.ObjectMapperRecord, this.tempData.itemId)
          dialog.close();
        }.bind(this),
      });

    },
    immediate: true,
    deep: true
  },
}
</script>

<style lang="scss">
@import "../../../node_modules/@OtailO-recommerce/rappid/rappid.css";
@import 'src/css/jointJS-style';


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

.text, .number, .select {
  color: black !important;
}

</style>
