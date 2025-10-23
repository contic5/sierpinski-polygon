import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'

class Polygon
{
  constructor(center,points,depth)
  {
    this.center=center;
    this.points=points;
    this.depth=depth;
  }
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
    //this.print_points();
    ctx.fillStyle=colors[this.depth];
    
    let region = new Path2D();
    region.moveTo(this.points[0][0],this.points[0][1]);
    for(let i=1;i<this.points.length;i++)
    {
      region.lineTo(this.points[i][0],this.points[i][1]);
    }
    region.lineTo(this.points[0][0],this.points[0][1]);
    region.closePath();

    ctx.fill(region);
  }
}

function create_polygon(center,radius,depth=0)
{

  let points=[];
  for(let i=0;i<sides;i++)
  {
    let angle=(2*Math.PI*i)/sides;
    let x=Math.round(radius*Math.cos(angle+offset_radians)+center[0]);
    let y=Math.round(radius*Math.sin(angle+offset_radians)+center[1]);
    points.push([x,y]);
  }
  polygons.push(new Polygon(center,points,depth));
  if(depth<=2)
  {
    generate_smaller_polygons(center,radius,depth);
  }
}
function generate_smaller_polygons(center,radius,depth)
{
  let scale_divisor=0;
  for(let k=1;k<=sides/4;k++)
  {
    scale_divisor+=Math.cos((2*Math.PI*k)/sides);
  }
  scale_divisor+=1;
  scale_divisor*=2;
  
  let scale_factor=1/scale_divisor;
  
  //console.log(scale_factor);

  for(let k=1;k<=sides;k++)
  {
    let x=(1-scale_factor)*radius*Math.cos((2*Math.PI*k)/sides+offset_radians)+center[0];
    let y=(1-scale_factor)*radius*Math.sin((2*Math.PI*k)/sides+offset_radians)+center[1];

    //console.log(x+" "+y);
    create_polygon([x,y],scale_factor*radius,depth+1);
  }
}
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

  let mid_y=(min_y+max_y)/2;
  return (c.height/2-mid_y);
}
function clear()
{
  ctx.fillStyle="#000000ff";
  ctx.fillRect(0,0,c.width,c.height);
}
function draw()
{
  clear();
  //ctx.rotate(offset_degrees*Math.PI/180);
  //ctx.translate(0,c.height/8);
  create_polygon([c.width/2,c.height/2],original_radius);

  offset_y=calculate_offset();
  ctx.translate(0,offset_y);
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

  

  ctx.translate(0,-offset_y);
  //ctx.rotate(-offset_degrees*Math.PI/180);

}
export function setup()
{
  polygons=[];
  sides=parseInt(document.getElementById("sides").value);
  document.getElementById("sides_value").innerHTML=sides;

  offset_degrees=0;
  if(sides==3||sides==5)
  {
    offset_degrees=90/sides;
  }
  offset_radians=offset_degrees*Math.PI/180;
  draw();
}

let colors=["#ff0000","#ff8c00","#ffff00","#11ff00ff"];
colors=["#6f88f7ff","#5a6ec8ff","#3e4d91ff","#262f59ff"];
let c=document.getElementById("my_canvas");
let ctx=c.getContext("2d");
let original_radius=c.width/2;
let sides=3;
let offset_degrees=0;
let offset_radians=0;
let offset_y=0;
let polygons=[];
setup();