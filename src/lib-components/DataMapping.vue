<template>
  <div class="canvas" ref="canvas"></div>
</template>

<script>

import { dia, elementTools, setTheme, shapes, ui, util } from '@clientio/rappid';
import { Link } from '../dataMappingLogic/shapes';
import { Decorator } from '../dataMappingLogic/highlighters';
import { Button, SourceArrowhead, TargetArrowhead } from '../dataMappingLogic/link-tools';
import { routerNamespace } from '../dataMappingLogic/routers';
import { anchorNamespace } from '../dataMappingLogic/anchors';
import { loadExample, records } from '../dataMappingLogic/example';
import { _replaceAll } from '../utils/strings';
import init from '../dataMappingLogic/init'

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
    }
  },

  data: () => ({
    $refs: {
      canvas: HTMLDivElement
    },
    graph: dia.Graph,
    paper: dia.Paper,
    scroller: ui.PaperScroller,
    toolbar: ui.Toolbar,
    toolbarHeight: 50,
    commandManager: dia.CommandManager
  }),
  methods: {
    showLinkTools(linkView) {
      let self = this
      const tools = new dia.ToolsView({
        tools: [
          new SourceArrowhead(),
          new TargetArrowhead(),
          new Button({
            distance: '25%',
            action: function () {
              self.linkAction(this.model);
            }
          })
        ]
      });
      linkView.addTools(tools);
    },

    linkAction(link) {
      const dialog = new ui.Dialog({
        title: 'Confirmation',
        width: 300,
        content: 'Are you sure you want to delete this link?',
        buttons: [
          { action: 'cancel', content: 'Cancel' },
          { action: 'remove', content: '<span style="color:#fe854f">Remove</span>' }
        ]
      });

      dialog.open();
      dialog.on({
        'action:remove': function () {
          link.remove();
          dialog.remove();
        },
        'action:cancel': function () {
          dialog.remove();
        }
      });
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
          element.addNextSibling(itemId, element.getDefaultItem());
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

    getItemByPath(items, path) {
      const item = items
      if (path.length <= 1) {
        return item
      }
      path.shift()
      return this.getItemByPath(items[path[0]], path)
    },

    linkEditAction(element, itemId, updateData, options) {

      const { linkView, evt, magnet, arrowhead, eventName } = options

      const path = element.getItemPathArray(itemId)
      this.editRecord(element, itemId, path, updateData, eventName)
    },

    editRecord(element, itemId, path, updateData, eventName) {
      if (!itemId) return;

      let items = element.attributes.items
      const item = this.getItemByPath(items, path)

      if (item._path && eventName === 'connect') {
        const inspector = new ui.Inspector({
          cell: element,
          live: false,
        });
        inspector.render();
        inspector.el.style.position = 'relative';
        inspector.el.style.overflow = 'hidden';

        const dialog = new ui.Dialog({
          width: 300,
          title: 'Are you sure you want to replace this ?',
          closeButton: false,
          content: inspector.el,
          buttons: [{
            content: 'Cancel',
            action: 'cancel'
          }, {
            content: '<span style="color:#fe854f">Confirm</span>',
            action: 'confirm'
          }]
        });

        dialog.open();
        dialog.on({
          'action:cancel': function () {
            this.commandManager.undo()
            inspector.remove();
            dialog.close();
          }.bind(this),
          'action:confirm': function () {
            element.item(itemId, updateData)
            inspector.remove();
            dialog.close();
          }.bind(this)
        });
      } else {

        element.item(itemId, updateData)
      }

      // const path = record.getItemPathArray(itemId);
      // const path = util.setByPath({ _path: 'TEST' }, itemPath)
    },

    itemDecoratorEditAction(element, itemId) {
      const config = { [itemId]: { type: 'content-editable', label: 'Decorator' } };
      const path = ['decorators'];
      this.itemAction(element, config, path);
    },

    itemEditAction(element, itemId) {
      let config = null
      if (element.id === records.ObjectMapper.id) {
        config = element.getObjectMapperInspectorConfig(itemId);
      } else {
        config = element.getJSONInspectorConfig(itemId);
      }

      const path = element.getItemPathArray(itemId);
      this.itemAction(element, config, path);
    },


    itemAction(element, config, itemPath) {

      if (!config || !itemPath)
        return;

      const inspector = new ui.Inspector({
        cell: element,
        live: false,
        inputs: util.setByPath({}, itemPath, config)
      });
      inspector.render();
      inspector.el.style.position = 'relative';
      inspector.el.style.overflow = 'hidden';

      const dialog = new ui.Dialog({
        width: 300,
        title: 'Edit Item',
        closeButton: false,
        content: inspector.el,
        buttons: [{
          content: 'Cancel',
          action: 'cancel'
        }, {
          content: '<span style="color:#fe854f">Change</span>',
          action: 'change'
        }]
      });

      dialog.open();
      dialog.on({
        'action:cancel': function () {
          inspector.remove();
          dialog.close();
        },
        'action:change': function () {
          inspector.updateCell();
          inspector.remove();
          dialog.close();
        }
      });

      const input = inspector.el.querySelector('[contenteditable]');
      if (input) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(input);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

  },
  created() {
    setTheme('material');

    const graph = this.graph = new dia.Graph({}, { cellNamespace: shapes });
    const paper = new dia.Paper({
      model: graph,
      width: 1000,
      height: 550,
      gridSize: 10,
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

    const toolbar = new ui.Toolbar({
      autoToggle: true,
      tools: [
        { type: 'undo' },
        { type: 'redo' },
        { type: 'zoomToFit' },
        { type: 'button', name: 'svg', text: 'Export SVG' }
      ],
      references: {
        commandManager: commandManager,
        paperScroller: scroller
      }
    });
    toolbar.on('svg:pointerclick', () => {
      paper.toSVG((svg) => {
        new ui.Lightbox({
          image: 'data:image/svg+xml,' + encodeURIComponent(svg),
          downloadable: true,
          fileName: 'DataMapping'
        }).open();
      }, {
        preserveDimensions: true,
        convertImagesToDataUris: true,
        useComputedStyles: false
      });
    });
    toolbar.render();

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
    } = init(this.objectMapperSchema, this.inputJson)

    loadExample(graph, { inputShape, objectMapperShape, outputShape }, { objectMapperToOutput, inputToObjectMapper })

    commandManager.listen();

    paper.on('blank:pointerdown', (evt) => scroller.startPanning(evt));

    paper.on('blank:mousewheel', (evt, ox, oy, delta) => {
      evt.preventDefault();
      zoom(ox, oy, delta);
    });

    paper.on('link:mousewheel', (_, evt, ox, oy, delta) => {
      evt.preventDefault();
      zoom(ox, oy, delta);
    });

    function zoom(x, y, delta) {
      scroller.zoom(delta * 0.2, { min: 0.4, max: 3, grid: 0.2, ox: x, oy: y });
    }

    paper.on('link:connect', (linkView, evt, elementViewConnected, magnet, arrowhead) => {
      let sourceId = linkView.model.attributes.source.port
      const itemId = elementViewConnected.findAttribute('item-id', magnet)
      const element = elementViewConnected.model;
      sourceId = _replaceAll(sourceId, "[0]", "[*]")
      evt.stopPropagation();

      const updateData = {
        _path: sourceId
      }

      this.linkEditAction(element, itemId, updateData, { linkView, evt, magnet, arrowhead, eventName: 'connect' })
    });

    paper.on('link:disconnect', (linkView, evt, elementViewDisconnected, magnet, arrowhead) => {
      const sourceId = linkView.model.attributes.source.port
      const itemId = elementViewDisconnected.findAttribute('item-id', magnet)
      const element = elementViewDisconnected.model;

      const updateData = {
        _path: ''
      }

      this.linkEditAction(element, itemId, updateData, { linkView, evt, magnet, arrowhead, eventName: 'disconnect' })
    });
    paper.on('link:pointerclick', (linkView, evt, elementView, magnet, arrowhead) => {
      // this.showLinkTools(linkView);
    });
    paper.on('link:mouseenter', (linkView) => {
      if (
          (linkView.model.attributes.source.id === records.ObjectMapper.id)
          &&
          (linkView.model.attributes.target.id === records.OutputTransformer.id)
      ) {
        return
      }
      this.showLinkTools(linkView);
    });

    paper.on('link:mouseleave', (linkView) => {
      linkView.removeTools();
    });

    paper.on('element:magnet:pointerdblclick', (elementView, evt, magnet) => {
      if (elementView.model.id === records.OutputTransformer.id) {
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
    const isFrozen = paper.isFrozen()
    console.log('isFrozen ? => ', isFrozen)
    paper.unfreeze();
    this.scroller = scroller
    this.paper = paper
    this.toolbar = toolbar
  },
  mounted() {
    const { scroller, paper, toolbar, $refs: { canvas } } = this;
    canvas.appendChild(this.scroller.el);
    canvas.appendChild(this.toolbar.el);
    toolbar.el.style.height = this.toolbarHeight + 'px';

    scroller.center();
    paper.unfreeze();
  }
})
</script>

<style lang="scss">
@import "~@clientio/rappid/rappid.css";
@import '../dataMappingLogic/styles.scss';

.canvas {
  width: 1800px;
  height: 1000px;

  .joint-paper {
    border: 1px solid #A0A0A0;
  }
}

</style>
