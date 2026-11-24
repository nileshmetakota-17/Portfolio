export const obstacles = [[100,100,67,140],[245,286,67,38],[405,210,83,135],[245,190,74,25]]
export const start = [90,350]
export function freePoint([x,y]) {
  return x>=60 && x<=500 && y>=60 && y<=430 && !obstacles.some(([a,b,w,h])=>x>=a-24 && x<=a+w+24 && y>=b-24 && y<=b+h+24)
}
export function planRoute(points) {
  let from=start
  const route=[start]
  for(const goal of points) {
    const end=goal.map(n=>Math.round(n/10)*10)
    if(!freePoint(end)) return null
    const key=p=>p.join(',')
    const queue=[from], seen=new Map([[key(from),null]])
    for(let i=0;i<queue.length && !seen.has(key(end));i++) {
      const p=queue[i]
      for(const [dx,dy] of [[10,0],[0,10],[-10,0],[0,-10]]) {
        const n=[p[0]+dx,p[1]+dy]
        if(freePoint(n)&&!seen.has(key(n))) {seen.set(key(n),p);queue.push(n)}
      }
    }
    if(!seen.has(key(end))) return null
    const segment=[]
    let cursor=end
    while(key(cursor)!==key(from)) {segment.push(cursor);cursor=seen.get(key(cursor))}
    route.push(...segment.reverse());from=end
  }
  return route
}
