/* Real vehicle photography, aligned to a common right-facing stage.
   Paint is previewed in canvas, retaining the source image's reflections and detail. */
window.VehicleVisuals=(()=>{
 const sources=new Map(),variants=new Map();
 const photos={porsche:{1:{file:'porsche-white.png',flip:true},2:{file:'porsche-black.png',flip:true}},x5:{1:{file:'x5-white.png',flip:true},2:{file:'x5-black.png',flip:true}},mini:{1:{file:'mini-white.png',flip:true},2:{file:'mini-black.png',flip:true}},series3:{1:{file:'series3-black.png',flip:true}},ix1:{1:{file:'ix1-black.png',flip:true}},taycan:{1:{file:'taycan-black.png',flip:false}}};
 const spec={
  porsche:{flip:false,base:157,wheels:[[.212,.775,.094,.26],[.807,.775,.094,.26]],glass:[[.27,.34],[.405,.085],[.56,.085],[.752,.32],[.745,.35],[.285,.35]]},
  x5:{flip:true,base:129,wheels:[[.203,.777,.098,.245],[.81,.777,.098,.245]],glass:[[.16,.11],[.70,.09],[.805,.34],[.17,.35]]},
  series3:{flip:true,base:210,wheels:[[.199,.775,.094,.26],[.808,.775,.094,.26]],glass:[[.235,.405],[.345,.09],[.644,.09],[.79,.35]]},
  mini:{flip:true,base:74,wheels:[[.21,.785,.10,.245],[.813,.785,.10,.245]],glass:[[.19,.09],[.72,.09],[.765,.43],[.19,.43]]},
  ix1:{flip:true,base:209,wheels:[[.205,.79,.098,.25],[.813,.79,.098,.25]],glass:[[.17,.10],[.69,.09],[.80,.35],[.19,.36]]},
  taycan:{flip:false,base:211,wheels:[[.212,.78,.093,.26],[.802,.78,.093,.26]],glass:[[.23,.39],[.38,.08],[.60,.08],[.79,.34]]}
 };
 function make(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
 function load(car,sourceColor=0){const photo=photos[car.id]?.[sourceColor];const sourceKey=car.id+":"+sourceColor;if(sources.has(sourceKey))return sources.get(sourceKey);const p=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{try{
   const raw=make(img.naturalWidth,img.naturalHeight),cx=raw.getContext('2d',{willReadFrequently:true});cx.drawImage(img,0,0);const rawPixels=cx.getImageData(0,0,raw.width,raw.height),data=rawPixels.data;
   // Remove only edge-connected white studio background, keeping enclosed paint highlights.
   if(data[3]>240){const seen=new Uint8Array(raw.width*raw.height),queue=new Int32Array(raw.width*raw.height);let head=0,tail=0;
    function add(x,y){if(x<0||y<0||x>=raw.width||y>=raw.height)return;const n=y*raw.width+x,i=n*4;if(seen[n])return;seen[n]=1;if(data[i]>246&&data[i+1]>246&&data[i+2]>246){queue[tail++]=n;data[i+3]=0;}}
    for(let x=0;x<raw.width;x++){add(x,0);add(x,raw.height-1);}for(let y=0;y<raw.height;y++){add(0,y);add(raw.width-1,y);}
    while(head<tail){const n=queue[head++],x=n%raw.width,y=Math.floor(n/raw.width);add(x-1,y);add(x+1,y);add(x,y-1);add(x,y+1);}cx.putImageData(rawPixels,0,0);
   }
   let left=raw.width,right=0,top=raw.height,bottom=0;
   for(let y=0;y<raw.height;y+=2)for(let x=0;x<raw.width;x+=2){const i=(y*raw.width+x)*4;if(data[i+3]>90&&Math.min(data[i],data[i+1],data[i+2])<218){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}}
   if(right<=left){left=0;right=raw.width;top=0;bottom=raw.height;}
   left=Math.max(0,left-4);right=Math.min(raw.width,right+4);top=Math.max(0,top-4);bottom=Math.min(raw.height,bottom+4);
   const cw=right-left,ch=bottom-top,scale=Math.min(1080/cw,488/ch),w=Math.round(cw*scale),h=Math.round(ch*scale),x=(1200-w)/2,y=528-h;
   const result=make(1200,560),r=result.getContext('2d',{willReadFrequently:true});r.save();if(photo?photo.flip:spec[car.id].flip){r.translate(x+w,y);r.scale(-1,1);r.drawImage(raw,left,top,cw,ch,0,0,w,h);}else r.drawImage(raw,left,top,cw,ch,x,y,w,h);r.restore();
   const pixels=r.getImageData(0,0,1200,560),mask=make(1200,560),m=mask.getContext('2d');m.fillStyle='white';m.fillRect(x+w*.025,y+h*.025,w*.95,h*.84);
   m.globalCompositeOperation='destination-out';const v=spec[car.id];m.beginPath();v.glass.forEach(([a,b],i)=>i?m.lineTo(x+w*a,y+h*b):m.moveTo(x+w*a,y+h*b));m.closePath();m.fill();
   v.wheels.forEach(([a,b,rx,ry])=>{m.beginPath();m.ellipse(x+w*a,y+h*b,w*rx*.76,h*ry*.87,0,0,Math.PI*2);m.fill();});
   // Retain lights, grilles, windows and lower sill detailing.
   m.fillRect(x+w*.956,y+h*.47,w*.044,h*.24);m.fillRect(x,y+h*.46,w*.035,h*.22);
   const maskData=m.getImageData(0,0,1200,560).data;
   resolve({canvas:result,pixels,mask:maskData,x,y,w,h,spec:v,initial:result.toDataURL('image/webp',.94)});
  }catch(e){reject(e);}};img.onerror=reject;img.src=photo?'velar-assets/'+photo.file:'velar-assets/'+car.image+'.webp';});sources.set(sourceKey,p);return p;}
 async function url(car,color=0){const key=car.id+':'+color;if(variants.has(key))return variants.get(key);const p=(async()=>{const realPhoto=photos[car.id]?.[color],src=await load(car,realPhoto?color:0);if(color===0||realPhoto)return src.initial;const name=car.colors[color].name.toLowerCase(),targets={white:[232,233,230],black:[43,48,51],silver:[160,171,175],grey:[111,124,130],red:[170,40,50]},target=targets[name]||[150,160,165];
  const out=make(1200,560),ctx=out.getContext('2d'),d=new ImageData(new Uint8ClampedArray(src.pixels.data),1200,560),a=d.data,base=src.spec.base;
  for(let i=0;i<a.length;i+=4){let alpha=src.mask[i+3]/255;if(a[i+3]<10)continue;const r=a[i],g=a[i+1],b=a[i+2],lum=.2126*r+.7152*g+.0722*b;
   const redPaint=car.id==='mini'&&r>g*1.45&&r>b*1.3&&r-g>32;
   if(car.id==='mini'){if(!redPaint)continue;alpha=1;}
   else {if(alpha<.01||lum<32||Math.min(r,g,b)>250)continue;if(Math.max(r,g,b)-Math.min(r,g,b)>65)continue;}
   const tone=name==='white'?175+lum*.29:name==='black'?9+lum*.22:name==='silver'?84+lum*.48:name==='grey'?48+lum*.40:50+lum*.4;
   const targetLum=.2126*target[0]+.7152*target[1]+.0722*target[2],blend=alpha*Math.max(0,Math.min(1,(lum-25)/22));
   for(let k=0;k<3;k++){const next=Math.min(255,tone*target[k]/targetLum);a[i+k]=a[i+k]*(1-blend)+next*blend;}
  }
  ctx.putImageData(d,0,0);return out.toDataURL('image/webp',.94);
 })();variants.set(key,p);return p;}
 async function paint(img,car,color=0,animate=true){if(!img)return;const key=car.id+':'+color;if(img.dataset.visualKey===key)return;img.dataset.visualKey=key;
  try{const next=await url(car,color);if(img.dataset.visualKey!==key)return;
   const frame=img.closest('.vehicle-frame');
   if(animate&&frame&&img.classList.contains('vehicle-ready')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){frame.querySelectorAll('.paint-overlay').forEach(e=>e.remove());const overlay=img.cloneNode();overlay.removeAttribute('id');overlay.removeAttribute('data-vehicle');overlay.className='paint-overlay';overlay.setAttribute('aria-hidden','true');overlay.src=next;overlay.style.opacity='0';frame.appendChild(overlay);requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.style.opacity='1'));setTimeout(()=>{if(img.dataset.visualKey===key){img.src=next;img.alt=car.colors[color].name+' '+car.brand+' '+car.name+', facing right';}overlay.remove();},780);
   }else{img.src=next;img.alt=car.colors[color].name+' '+car.brand+' '+car.name+', facing right';}
   img.classList.add('vehicle-ready');
  }catch{img.classList.add('vehicle-ready');}
 }
 return{paint,url};
})();
