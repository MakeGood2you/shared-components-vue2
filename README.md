# Shared Components for Vue 2 - JSON Editor, Data Mapping, and JointJS

This project provides reusable **Vue.js 2** components for building dynamic and modular user interfaces, with a particular focus on a **JSON Editor**, **Data Mapping** components, and **JointJS** integrations for diagramming and visual workflows.

---

## About the Project

The `shared-components-vue2` project delivers powerful tools for managing and visualizing data:

1. **JSON Editor**: An interactive editor for viewing, editing, and validating JSON data.
2. **Data Mapping**: Components for mapping relationships between data structures.
3. **JointJS Integration**: Tools for building advanced diagramming interfaces using **JointJS**.

These components are designed for flexibility, reusability, and seamless integration into **Vue 2** applications.

---

## Features

### JSON Editor
- **Two-way data binding** with `v-model` for real-time JSON updates.
- **Syntax highlighting** for improved readability.
- **Validation** for detecting invalid JSON input.
- **Customizable**: Easily configure read-only mode and styling.

### Data Mapping
- **Intuitive Mapping UI**: Create and visualize data relationships.
- **Flexible Input/Output**: Supports different data structures.
- **Interactive**: Users can manually adjust or validate mappings.

### JointJS Integration
- **Diagramming Tools**: Build interactive flowcharts, process diagrams, and custom visualizations.
- **Custom Node Styling**: Easily style nodes, links, and connections.
- **Dynamic Updates**: Real-time diagram updates based on user actions.
- **Extensibility**: JointJS-based components can be extended to support advanced use cases.

---

## Folder Structure

```
shared-components-vue2/
├── src/
│   ├── lib-components/
│   │   ├── JsonEditor.vue       # JSON Editor component
│   │   ├── DataMapping.vue      # Data Mapping component
│   │   ├── DiagramEditor.vue    # JointJS-based diagramming tool
│   │   ├── index.js             # Export components
│   └── utils/                   # Shared utility functions
├── package.json                 # Project configuration
└── README.md                    # Documentation
```

---

## Installation

1. **Install via npm**:
   ```bash
   npm install shared-components-vue2 --save
   ```

2. **Import Components**:
   ```javascript
   import { JsonEditor, DataMapping, DiagramEditor } from 'shared-components-vue2';

   export default {
     components: {
       JsonEditor,
       DataMapping,
       DiagramEditor
     }
   };
   ```

3. **Use in Templates**:

   ```html
   <template>
     <div>
       <h2>JSON Editor</h2>
       <JsonEditor v-model="jsonData" />
       
       <h2>Data Mapping</h2>
       <DataMapping :inputData="sourceData" :outputData="targetData" />
       
       <h2>Diagram Editor</h2>
       <DiagramEditor />
     </div>
   </template>

   <script>
   export default {
     data() {
       return {
         jsonData: { "example": "data" },
         sourceData: { key1: "value1" },
         targetData: { key2: "value2" }
       };
     }
   };
   </script>
   ```

---

## Components Overview

### JsonEditor
- **Props**:
  - `v-model`: Bind JSON data to the editor.
  - `readonly`: Set to `true` to prevent editing.
- **Example**:
   ```html
   <JsonEditor v-model="jsonData" readonly />
   ```

### DataMapping
- **Props**:
  - `inputData`: Source data for mapping.
  - `outputData`: Target data to map to.
- **Example**:
   ```html
   <DataMapping :inputData="source" :outputData="target" />
   ```

### DiagramEditor (JointJS Integration)
- Built with **JointJS** for diagramming and workflow visualizations.
- **Use Cases**:
  - Flowchart builders.
  - Visual process diagrams.
  - Custom node-based UI editors.


## Development

1. Clone the repository:
   ```bash
   git clone https://github.com/MakeGood2you/shared-components-vue2.git
   cd shared-components-vue2
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run serve
   ```

---

## Build for Production

To create a production build:
```bash
npm run build
```

---

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for bugs and feature requests.

---

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## Contact

- **GitHub**: [MakeGood2you/shared-components-vue2](https://github.com/MakeGood2you/shared-components-vue2)
- **Email**: Makegood2you@gmail.com

---

Happy Coding! 🚀
