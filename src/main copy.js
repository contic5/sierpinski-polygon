import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'

function draw_polygon(points,depth)
{
  console.log(points);
  ctx.fillStyle=colors[depth];
  
  let region = new Path2D();
  region.moveTo(points[0][0],points[0][1]);
  for(let i=1;i<points.length;i++)
  {
    region.lineTo(points[i][0],points[i][1]);
  }
  region.lineTo(points[0][0],points[0][1]);
  region.closePath();

  ctx.fill(region);
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
  draw_polygon(points,depth);
  if(depth<=1)
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
  
  console.log(scale_factor);

  for(let k=1;k<=sides;k++)
  {
    let x=(1-scale_factor)*radius*Math.cos((2*Math.PI*k)/sides)+center[0];
    let y=(1-scale_factor)*radius*Math.sin((2*Math.PI*k)/sides)+center[1];

    console.log(x+" "+y);
    create_polygon([x,y],scale_factor*radius,depth+1);
  }
}
function clear()
{
  ctx.fillStyle="#ffffffff";
  ctx.fillRect(0,0,c.width,c.height);
}
function draw()
{
  clear();
  //ctx.rotate(offset_degrees*Math.PI/180);
  create_polygon([c.width/2,c.height/2],original_radius)
  //ctx.rotate(-offset_degrees*Math.PI/180);
}
function setup()
{
  draw();
}

let colors=["#ff0000","#00ff00","#0000ff"];
let c=document.getElementById("my_canvas");
let ctx=c.getContext("2d");
let original_radius=c.width/2;
let sides=3;
let offset_degrees=30;
let offset_radians=offset_degrees*Math.PI/180;
setup();