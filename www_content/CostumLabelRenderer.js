  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.labels');

  /**
* This label renderer will just display the label on the right of the node.
*
* @param {object} node The node object.
* @param {CanvasRenderingContext2D} context The canvas context.
* @param {configurable} settings The settings function.
*/
  sigma.canvas.labels.def = function(node, context, settings) {
    var fontSize;
    var prefix = settings('prefix') || '';

    if(node.highlight){ 
      var size = node[prefix + 'size']*1.2;
    }else{
      var size = node[prefix + 'size'];
    }

    if ((size < settings('labelThreshold') && !node.highlight) ||( node.highlight && size < (settings('labelThreshold')/1.5) ))
      return;

    if (typeof node.label !== 'string')
      return;
    if(node.highlight){      
      fontSize = (settings('labelSize') === 'fixed') ?
        settings('defaultLabelSize') :
        settings('labelSizeRatio') * size*1.2;
      }else{
      fontSize = (settings('labelSize') === 'fixed') ?
        settings('defaultLabelSize') :
        settings('labelSizeRatio') * size;
    }
    context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
      fontSize + 'px ' + settings('font');
    context.fillStyle = (settings('labelColor') === 'node') ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultLabelColor');

    context.fillText(
      node.label,
      Math.round(node[prefix + 'x'] + size + 3),
      Math.round(node[prefix + 'y'] + fontSize / 3)
    );
  };