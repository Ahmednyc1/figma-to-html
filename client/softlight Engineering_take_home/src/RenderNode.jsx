export default function RenderNode({ node, parentBox = null }) {
    if (!node) return null;
  
    const style = {};
    const box = node.absoluteBoundingBox;
  
    if (box) {
      style.position = "absolute";
      
      // If we have a parent, calculate position relative to it
      if (parentBox) {
        style.left = box.x - parentBox.x;
        style.top = box.y - parentBox.y;
      } else {
        // Root element - no offset needed
        style.left = 0;
        style.top = 0;
      }
      
      style.width = box.width;
      style.height = box.height;
    }
  
    // borders
    if (node.strokes && node.strokes.length > 0 && node.strokeWeight) {
      const stroke = node.strokes[0];
      if (stroke.type === "SOLID") {
        const c = stroke.color;
        const strokeColor = `rgba(${Math.round(c.r * 255)}, ${Math.round(
          c.g * 255
        )}, ${Math.round(c.b * 255)}, ${stroke.opacity ?? 1})`;
        style.border = `${node.strokeWeight}px solid ${strokeColor}`;
      }
    }
  
    // border radius
    if (typeof node.cornerRadius === "number") {
      style.borderRadius = node.cornerRadius;
    }
  
    // TEXT node
    if (node.type === "TEXT") {
      const textStyle = node.style || {};
      const textDivStyle = {
        ...style,
        fontSize: textStyle.fontSize,
        fontWeight: textStyle.fontWeight,
        fontFamily: textStyle.fontFamily,
        lineHeight: textStyle.lineHeightPx ? `${textStyle.lineHeightPx}px` : undefined,
        letterSpacing: textStyle.letterSpacing,
        textAlign: textStyle.textAlignHorizontal?.toLowerCase(),
        color: "#000",
        whiteSpace: "pre-wrap",
        display: "flex",
        alignItems: "center", // vertically center text
      };
  
      if (node.fills && node.fills.length > 0 && node.fills[0].type === "SOLID") {
        const fill = node.fills[0];
        const c = fill.color;
        const o = fill.opacity ?? 1;
        textDivStyle.color = `rgba(${Math.round(c.r * 255)}, ${Math.round(
          c.g * 255
        )}, ${Math.round(c.b * 255)}, ${o})`;
      }
  
      return <div style={textDivStyle}>{node.characters}</div>;
    }
  
    // non-text fills → background
    if (node.fills && node.fills.length > 0 && node.fills[0].type === "SOLID") {
      const fill = node.fills[0];
      const c = fill.color;
      const o = fill.opacity ?? 1;
      style.backgroundColor = `rgba(${Math.round(c.r * 255)}, ${Math.round(
        c.g * 255
      )}, ${Math.round(c.b * 255)}, ${o})`;
    }
  
    // render children, passing this node's box as the parent
    return (
      <div style={style}>
        {node.children &&
          node.children.map((child) => (
            <RenderNode key={child.id} node={child} parentBox={box} />
          ))}
      </div>
    );
  }