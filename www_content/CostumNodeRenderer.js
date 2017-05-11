  sigma.utils.pkg('sigma.canvas.nodes');

  sigma.canvas.nodes.def = function(node, context, settings) {
    var prefix = settings('prefix') || '';

    context.fillStyle = node.color || settings('defaultNodeColor');
    context.beginPath();

    var Radius;
    if(node.highlight){
      Radius = node[prefix + 'size']*1.3;
    }else{
      Radius = node[prefix + 'size'];
    }
    
    context.arc(
      node[prefix + 'x'],
      node[prefix + 'y'],
      Radius,
      0,
      Math.PI * 2,
      true
    );

    context.closePath();
    context.fill();
    if(node.highlight){
      context.lineWidth = 2;
      context.strokeStyle = '#333333';
      context.stroke();
    }
  };