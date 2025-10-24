import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'

//Class that store a polygon, including its center, each point on the polygon and the recursion depth the polygon was created at.
class Polygon
{
  //Constructor
  constructor(center,points,depth)
  {
    this.center=center;
    this.points=points;
    this.depth=depth;
  }

  //Documentation function
  print_points()
  {
    let res="[";
    for(let point of this.points)
    {
      res+="[";
      res+=point[0]+","+point[1];
      res+="]";
    }
    res+="] ";
    res+=this.depth;
    console.log(res);
  }

  draw()
  {

    //Only draw polygons if they are at least a certain depth.
    if(this.depth<min_draw_depth)
    {
      return;
    }
    //this.print_points();
    ctx.fillStyle=colors[this.depth-1];
    
    //Create a new Path2D that uses the points in the polygon. Start at the first point and then travel to each point.
    let region = new Path2D();
    region.moveTo(this.points[0][0],this.points[0][1]);
    for(let i=1;i<this.points.length;i++)
    {
      region.lineTo(this.points[i][0],this.points[i][1]);
    }
    //Travel back to the first point.
    region.lineTo(this.points[0][0],this.points[0][1]);
    region.closePath();

    ctx.fill(region);
  }
}


function create_polygon_from_center(center,radius,depth=0)
{

  //Generate points for a polygon
  let points=[];

  //Each point should be spread out evenly anglewise
  for(let i=0;i<sides;i++)
  {
    //Use angle to create points
    let angle=(2*Math.PI*i)/sides;
    let x=Math.round(radius*Math.cos(angle+offset_radians)+center[0]);
    let y=Math.round(radius*Math.sin(angle+offset_radians)+center[1]);
    points.push([x,y]);
  }
  polygons.push(new Polygon(center,points,depth));

  //Only generate smaller polygons if depth is less than or equal to 2.
  if(depth<max_depth)
  {
    generate_smaller_polygons(center,radius,depth);
  }
}
function generate_smaller_polygons(center,radius,depth)
{
  /*
  The scale factor is based on https://larryriddle.agnesscott.org/ifs/pentagon/sierngon.htm
  */

  let scale_divisor=0;
  for(let k=1;k<=sides/4;k++)
  {
    scale_divisor+=Math.cos((2*Math.PI*k)/sides);
  }
  scale_divisor+=1;
  scale_divisor*=2;
  
  let scale_factor=1/scale_divisor;
  
  //console.log(scale_factor);

  /*
  Generate smaller polygons.
  https://larryriddle.agnesscott.org/ifs/pentagon/ngondet.htm
  Each central angle is equal to 2*pi/n, so if w denotes the distance from the center to the vertex, then the vertices are at the points (w*cos(2 pi*k/n), w*sin(2 pi*k/n) for k = 1 to n. Therefore, the translation for the kth function is
  */

  let centers=[];
  for(let k=1;k<=sides;k++)
  {
    let center_x=(1-scale_factor)*radius*Math.cos((2*Math.PI*k)/sides+offset_radians)+center[0];
    let center_y=(1-scale_factor)*radius*Math.sin((2*Math.PI*k)/sides+offset_radians)+center[1];
    centers.push([center_x,center_y]);

    //console.log(x+" "+y);
    //Turn the center points into a polygon. Increase the depth by 1 to prevent infinite recursion.
    create_polygon_from_center([center_x,center_y],scale_factor*radius,depth+1);
  }


}

//This function centers the largest polygon.
function calculate_offset()
{
  let min_y=9999;
  let max_y=-9999;
  for(let polygon of polygons)
  {
    min_y=Math.min(min_y,polygon.center[1]);
    max_y=Math.max(max_y,polygon.center[1]);

    for(let point of polygon.points)
    {
      min_y=Math.min(min_y,point[1]);
      max_y=Math.max(max_y,point[1]);
    }
  }

  //The midpoint is the (min_y+max_y)/2. The offset is the midpoint of the canvas minus the midpoint of the polygon.
  let mid_y=(min_y+max_y)/2;
  return (c.height/2-mid_y);
}

//Erase everything on the screen.
function clear()
{
  ctx.fillStyle="#000000ff";
  ctx.fillRect(0,0,c.width,c.height);
}
function draw()
{
  clear();
  create_polygon_from_center([c.width/2,c.height/2],original_radius);

  //Calculate the offset
  const offset_y=calculate_offset();

  //Translate with the offset
  ctx.translate(0,offset_y);

  //Draw the polygons with the highest depth first
  polygons.sort((a,b) => a.depth - b.depth);
  for(let polygon of polygons)
  {
    polygon.draw();
  }

  /*
  ctx.fillStyle="#000000";
  ctx.fillRect(c.width/2-20,c.height/2-20,40,40);
  ctx.translate(0,-offset_y);
  */

  
  //Translate with the negative offset
  ctx.translate(0,-offset_y);
  //ctx.rotate(-offset_degrees*Math.PI/180);

}
export function setup()
{
  polygons=[];

  sides=parseInt(document.getElementById("sides").value);
  document.getElementById("sides_value").innerHTML=sides;

  max_depth=parseInt(document.getElementById("max_depth").value);
  document.getElementById("max_depth_value").innerHTML=max_depth;

  min_draw_depth=parseInt(document.getElementById("min_draw_depth").value);
  //Make sure that the min draw depth is not greater than the max depth.

  min_draw_depth=Math.min(max_depth,min_draw_depth);
  document.getElementById("min_draw_depth").value=min_draw_depth;
  document.getElementById("min_draw_depth_value").innerHTML=min_draw_depth;

  //Rotate the polygon if it has an odd number of sides.
  offset_degrees=0;
  if(sides%2==1)
  {
    offset_degrees=90/sides;
  }
  offset_radians=offset_degrees*Math.PI/180;
  draw();
}

//Colors for the pattern
let colors=["#ff0000","#ff8c00","#ffff00","#11ff00ff","#0088ffff"];
//colors=["#6f88f7ff","#5a6ec8ff","#3e4d91ff","#262f59ff"];
let c=document.getElementById("my_canvas");
let ctx=c.getContext("2d");

let original_radius=c.width/2;
//How many sides the polygon has
let sides=3;

//The maximum depth for generating polygons.
let max_depth=4;

//The minimum depth for drawing polygons.
let min_draw_depth=4;

let offset_degrees=0;
let offset_radians=0;
let polygons=[];
setup();