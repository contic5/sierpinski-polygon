# Sierpinski Polygon

The Sierpinski Polygon is a fractal made from a polygon. A polygon is a shape with sides that have the same length. The Sierpinski Polygon is a fractal that repeatedly makes smaller versions of a larger polygon. Depth refers to how many times we went from the original polygon to smaller polygons. The original polygon has depth 1, the first smaller polygons have depth 2 and so on.

Drawing the Sierpinski Polygon has several steps. The first step is creating the original polygon. The original polygon has each point equally spread apart from the canvas center and each other. With n sides, Vertex i is located at x=center_x-size*cos(i/(2π*n)) y=center_y-size*sin(i/(2π*n)).

Afterwards, we determine where to place each smaller polygon. I use an advanced formula to calculate the new center and the new size. With n sides, Vertex i is located at x=new_center_x-new_size*cos(i/(2π*n)) y=new_center_y-new_size*sin(i/(2π*n)). Now though, center_x and center_y are the centers of the new polygon. This article explains more about how scaling and positioning are calculated: 
https://larryriddle.agnesscott.org/ifs/pentagon/sierngon.htm

We then create the smaller polygons in the same way as the original polygon. Afterwards, we can create smaller polygons from the smaller polygons.

To draw each polygon, I move to the first vertex in the polygon. I then draw a line from vertex 1 to vertex 2, vertex 2 to vertex 3 and finally vertex n to vertex 1. I then fill in the space inside the lines I made.

I can change the pattern by only drawing polygons at a certain depth.
