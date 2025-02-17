import { nestLists, LIST_NEST_MODE_HTML, isPortableTextToolkitList, isPortableTextListItemBlock, isPortableTextToolkitSpan, isPortableTextBlock, isPortableTextToolkitTextNode, spanToPlainText, buildMarksTree } from '@portabletext/toolkit';
export { toPlainText } from '@portabletext/toolkit';
import { jsx, Fragment } from 'react/jsx-runtime';
import { useMemo } from 'react';
function mergeComponents(parent, overrides) {
  const {
    block,
    list,
    listItem,
    marks,
    types,
    ...rest
  } = overrides;
  return {
    ...parent,
    block: mergeDeeply(parent, overrides, "block"),
    list: mergeDeeply(parent, overrides, "list"),
    listItem: mergeDeeply(parent, overrides, "listItem"),
    marks: mergeDeeply(parent, overrides, "marks"),
    types: mergeDeeply(parent, overrides, "types"),
    ...rest
  };
}
function mergeDeeply(parent, overrides, key) {
  const override = overrides[key];
  const parentVal = parent[key];
  if (typeof override === "function") {
    return override;
  }
  if (override && typeof parentVal === "function") {
    return override;
  }
  if (override) {
    return {
      ...parentVal,
      ...override
    };
  }
  return parentVal;
}
const link = _ref => {
  let {
    children,
    value
  } = _ref;
  return /* @__PURE__ */jsx("a", {
    href: value == null ? void 0 : value.href,
    children
  });
};
const underlineStyle = {
  textDecoration: "underline"
};
const defaultMarks = {
  em: _ref2 => {
    let {
      children
    } = _ref2;
    return /* @__PURE__ */jsx("em", {
      children
    });
  },
  strong: _ref3 => {
    let {
      children
    } = _ref3;
    return /* @__PURE__ */jsx("strong", {
      children
    });
  },
  code: _ref4 => {
    let {
      children
    } = _ref4;
    return /* @__PURE__ */jsx("code", {
      children
    });
  },
  underline: _ref5 => {
    let {
      children
    } = _ref5;
    return /* @__PURE__ */jsx("span", {
      style: underlineStyle,
      children
    });
  },
  "strike-through": _ref6 => {
    let {
      children
    } = _ref6;
    return /* @__PURE__ */jsx("del", {
      children
    });
  },
  link
};
const defaultLists = {
  number: _ref7 => {
    let {
      children
    } = _ref7;
    return /* @__PURE__ */jsx("ol", {
      children
    });
  },
  bullet: _ref8 => {
    let {
      children
    } = _ref8;
    return /* @__PURE__ */jsx("ul", {
      children
    });
  }
};
const DefaultListItem = _ref9 => {
  let {
    children
  } = _ref9;
  return /* @__PURE__ */jsx("li", {
    children
  });
};
const getTemplate = (type, prop) => "[@portabletext/react] Unknown ".concat(type, ", specify a component for it in the `components.").concat(prop, "` prop");
const unknownTypeWarning = typeName => getTemplate("block type \"".concat(typeName, "\""), "types");
const unknownMarkWarning = markType => getTemplate("mark type \"".concat(markType, "\""), "marks");
const unknownBlockStyleWarning = blockStyle => getTemplate("block style \"".concat(blockStyle, "\""), "block");
const unknownListStyleWarning = listStyle => getTemplate("list style \"".concat(listStyle, "\""), "list");
const unknownListItemStyleWarning = listStyle => getTemplate("list item style \"".concat(listStyle, "\""), "listItem");
function printWarning(message) {
  console.warn(message);
}
const hidden = {
  display: "none"
};
const DefaultUnknownType = _ref10 => {
  let {
    value,
    isInline
  } = _ref10;
  const warning = unknownTypeWarning(value._type);
  return isInline ? /* @__PURE__ */jsx("span", {
    style: hidden,
    children: warning
  }) : /* @__PURE__ */jsx("div", {
    style: hidden,
    children: warning
  });
};
const DefaultUnknownMark = _ref11 => {
  let {
    markType,
    children
  } = _ref11;
  return /* @__PURE__ */jsx("span", {
    className: "unknown__pt__mark__".concat(markType),
    children
  });
};
const DefaultUnknownBlockStyle = _ref12 => {
  let {
    children
  } = _ref12;
  return /* @__PURE__ */jsx("p", {
    children
  });
};
const DefaultUnknownList = _ref13 => {
  let {
    children
  } = _ref13;
  return /* @__PURE__ */jsx("ul", {
    children
  });
};
const DefaultUnknownListItem = _ref14 => {
  let {
    children
  } = _ref14;
  return /* @__PURE__ */jsx("li", {
    children
  });
};
const DefaultHardBreak = () => /* @__PURE__ */jsx("br", {});
const defaultBlockStyles = {
  normal: _ref15 => {
    let {
      children
    } = _ref15;
    return /* @__PURE__ */jsx("p", {
      children
    });
  },
  blockquote: _ref16 => {
    let {
      children
    } = _ref16;
    return /* @__PURE__ */jsx("blockquote", {
      children
    });
  },
  h1: _ref17 => {
    let {
      children
    } = _ref17;
    return /* @__PURE__ */jsx("h1", {
      children
    });
  },
  h2: _ref18 => {
    let {
      children
    } = _ref18;
    return /* @__PURE__ */jsx("h2", {
      children
    });
  },
  h3: _ref19 => {
    let {
      children
    } = _ref19;
    return /* @__PURE__ */jsx("h3", {
      children
    });
  },
  h4: _ref20 => {
    let {
      children
    } = _ref20;
    return /* @__PURE__ */jsx("h4", {
      children
    });
  },
  h5: _ref21 => {
    let {
      children
    } = _ref21;
    return /* @__PURE__ */jsx("h5", {
      children
    });
  },
  h6: _ref22 => {
    let {
      children
    } = _ref22;
    return /* @__PURE__ */jsx("h6", {
      children
    });
  }
};
const defaultComponents = {
  types: {},
  block: defaultBlockStyles,
  marks: defaultMarks,
  list: defaultLists,
  listItem: DefaultListItem,
  hardBreak: DefaultHardBreak,
  unknownType: DefaultUnknownType,
  unknownMark: DefaultUnknownMark,
  unknownList: DefaultUnknownList,
  unknownListItem: DefaultUnknownListItem,
  unknownBlockStyle: DefaultUnknownBlockStyle
};
function PortableText(_ref23) {
  let {
    value: input,
    components: componentOverrides,
    listNestingMode,
    onMissingComponent: missingComponentHandler = printWarning
  } = _ref23;
  const handleMissingComponent = missingComponentHandler || noop;
  const blocks = Array.isArray(input) ? input : [input];
  const nested = nestLists(blocks, listNestingMode || LIST_NEST_MODE_HTML);
  const components = useMemo(() => {
    return componentOverrides ? mergeComponents(defaultComponents, componentOverrides) : defaultComponents;
  }, [componentOverrides]);
  const renderNode = useMemo(() => getNodeRenderer(components, handleMissingComponent), [components, handleMissingComponent]);
  const rendered = nested.map((node, index) => renderNode({
    node,
    index,
    isInline: false,
    renderNode
  }));
  return /* @__PURE__ */jsx(Fragment, {
    children: rendered
  });
}
const getNodeRenderer = (components, handleMissingComponent) => {
  function renderNode(options) {
    const {
      node,
      index,
      isInline
    } = options;
    const key = node._key || "node-".concat(index);
    if (isPortableTextToolkitList(node)) {
      return renderList(node, index, key);
    }
    if (isPortableTextListItemBlock(node)) {
      return renderListItem(node, index, key);
    }
    if (isPortableTextToolkitSpan(node)) {
      return renderSpan(node, index, key);
    }
    if (isPortableTextBlock(node)) {
      return renderBlock(node, index, key, isInline);
    }
    if (isPortableTextToolkitTextNode(node)) {
      return renderText(node, key);
    }
    return renderCustomBlock(node, index, key, isInline);
  }
  function renderListItem(node, index, key) {
    const tree = serializeBlock({
      node,
      index,
      isInline: false,
      renderNode
    });
    const renderer = components.listItem;
    const handler = typeof renderer === "function" ? renderer : renderer[node.listItem];
    const Li = handler || components.unknownListItem;
    if (Li === components.unknownListItem) {
      const style = node.listItem || "bullet";
      handleMissingComponent(unknownListItemStyleWarning(style), {
        type: style,
        nodeType: "listItemStyle"
      });
    }
    let children = tree.children;
    if (node.style && node.style !== "normal") {
      const {
        listItem,
        ...blockNode
      } = node;
      children = renderNode({
        node: blockNode,
        index,
        isInline: false,
        renderNode
      });
    }
    return /* @__PURE__ */jsx(Li, {
      value: node,
      index,
      isInline: false,
      renderNode,
      children
    }, key);
  }
  function renderList(node, index, key) {
    const children = node.children.map((child, childIndex) => renderNode({
      node: child._key ? child : {
        ...child,
        _key: "li-".concat(index, "-").concat(childIndex)
      },
      index,
      isInline: false,
      renderNode
    }));
    const component = components.list;
    const handler = typeof component === "function" ? component : component[node.listItem];
    const List = handler || components.unknownList;
    if (List === components.unknownList) {
      const style = node.listItem || "bullet";
      handleMissingComponent(unknownListStyleWarning(style), {
        nodeType: "listStyle",
        type: style
      });
    }
    return /* @__PURE__ */jsx(List, {
      value: node,
      index,
      isInline: false,
      renderNode,
      children
    }, key);
  }
  function renderSpan(node, _index, key) {
    const {
      markDef,
      markType,
      markKey
    } = node;
    const Span = components.marks[markType] || components.unknownMark;
    const children = node.children.map((child, childIndex) => renderNode({
      node: child,
      index: childIndex,
      isInline: true,
      renderNode
    }));
    if (Span === components.unknownMark) {
      handleMissingComponent(unknownMarkWarning(markType), {
        nodeType: "mark",
        type: markType
      });
    }
    return /* @__PURE__ */jsx(Span, {
      text: spanToPlainText(node),
      value: markDef,
      markType,
      markKey,
      renderNode,
      children
    }, key);
  }
  function renderBlock(node, index, key, isInline) {
    const {
      _key,
      ...props
    } = serializeBlock({
      node,
      index,
      isInline,
      renderNode
    });
    const style = props.node.style || "normal";
    const handler = typeof components.block === "function" ? components.block : components.block[style];
    const Block = handler || components.unknownBlockStyle;
    if (Block === components.unknownBlockStyle) {
      handleMissingComponent(unknownBlockStyleWarning(style), {
        nodeType: "blockStyle",
        type: style
      });
    }
    return /* @__PURE__ */jsx(Block, {
      ...props,
      value: props.node,
      renderNode
    }, key);
  }
  function renderText(node, key) {
    if (node.text === "\n") {
      const HardBreak = components.hardBreak;
      return HardBreak ? /* @__PURE__ */jsx(HardBreak, {}, key) : "\n";
    }
    return node.text;
  }
  function renderCustomBlock(node, index, key, isInline) {
    const Node = components.types[node._type];
    const nodeOptions = {
      value: node,
      isInline,
      index,
      renderNode
    };
    if (Node) {
      return /* @__PURE__ */jsx(Node, {
        ...nodeOptions
      }, key);
    }
    handleMissingComponent(unknownTypeWarning(node._type), {
      nodeType: "block",
      type: node._type
    });
    const UnknownType = components.unknownType;
    return /* @__PURE__ */jsx(UnknownType, {
      ...nodeOptions
    }, key);
  }
  return renderNode;
};
function serializeBlock(options) {
  const {
    node,
    index,
    isInline,
    renderNode
  } = options;
  const tree = buildMarksTree(node);
  const children = tree.map((child, i) => renderNode({
    node: child,
    isInline: true,
    index: i,
    renderNode
  }));
  return {
    _key: node._key || "block-".concat(index),
    children,
    index,
    isInline,
    node
  };
}
function noop() {}
export { PortableText, defaultComponents, mergeComponents };
//# sourceMappingURL=react-portable-text.esm.js.map
