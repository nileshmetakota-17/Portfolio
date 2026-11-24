// Synthetic XYZ samples of obstacle surfaces, projected into the existing XY map.
/** @param {number[]} bounds @param {number} height */
export function obstacleCloud(bounds, height) {
  const [x,y,width,depth] = bounds
  const samples=[]
  const add=(px,py,z)=>samples.push({x:px,y:py,z,cx:px+z*.38,cy:py-z*.65})
  for(let z=0;z<=height;z+=6){
    for(let dx=0;dx<=width;dx+=9){add(x+dx,y,z);add(x+dx,y+depth,z)}
    for(let dy=9;dy<depth;dy+=9){add(x,y+dy,z);add(x+width,y+dy,z)}
  }
  for(let dx=0;dx<=width;dx+=9)for(let dy=0;dy<=depth;dy+=9)add(x+dx,y+dy,height)
  return samples.sort((a,b)=>a.z-b.z)
}
