///////////////////////////////////COSTUM COLOR Edge Renderer.... pretty Simple
    sigma.utils.pkg('sigma.canvas.edges');
      sigma.canvas.edges.def = function(edge, source, target, context, settings) {
        var color = edge.color,
            prefix = settings('prefix') || '',
            edgeColor = "self",
            defaultNodeColor = settings('defaultNodeColor'),
            defaultEdgeColor = settings('defaultEdgeColor');

        if (!color)
          switch (edgeColor) {
            case 'source':
              color = source.color || defaultNodeColor;
              break;
            case 'target':
              color = target.color || defaultNodeColor;
              break;
	    case 'self':
              color = edge.viz.color || defaultNodeColor;
              break;
            default:
              color = defaultEdgeColor;
              break;
          }


    context.strokeStyle = color;
    context.lineWidth = edge[prefix + 'size'] || 1;
    context.beginPath();

    context.moveTo(
      source[prefix + 'x'],
      source[prefix + 'y']
    );
    context.lineTo(
      target[prefix + 'x'],
      target[prefix + 'y']
    );
    context.stroke();
      };
