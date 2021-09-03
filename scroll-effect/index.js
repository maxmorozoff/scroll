const scroll3d = block => {
    const oldItems = block.querySelectorAll('section.scroll-3d > section.item'),
    drawer = block.querySelector('div.drawer > div'),
    scrollOffset = {max:0,min:0},
    items = [];
    
    console.dir(oldItems[0])
    console.dir(oldItems[4])

    let fragment = new DocumentFragment(), num=0, now=0, dir=0,
        scrollHeight=0;

    // Clamp number between two values with the following line:
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    const getHeight=_=>{
        let h=0
        for (const el of oldItems) {
            h+=el.scrollHeight
        }
        return h
    }
    const setHeight=_=>scrollHeight = getHeight()*.95;
    setHeight()

    window.addEventListener( 'resize', setHeight, false );
    console.log(scrollHeight)

    console.log(oldItems, drawer)
    oldItems.forEach((e,i) => {
        let clone = e.cloneNode(true)
        fragment.appendChild(clone)
        e.classList.add('hidden')
        items.push(clone)
        if (!i) scrollOffset.min = e.offsetTop;
        scrollOffset.max = e.offsetTop;
    })
    drawer.appendChild(fragment)

    function transform(params) {
        num = params
        now = Math.round(num);
        items.forEach((e,i)=>{
            let n = num-i;
            e.style = `--z:${-n};--y:${n};
                --o:${clamp(n>0?1-n*.5:n+1,0,1)};
                --b:${clamp(n<0? -n*.5:n*n,0,1)};
                --n:${num};
                --r:${-dir/2}deg;`
                // --s:${n>0.53?1+(Math.sin(n-.53))*.1 :1}`
        })
    }
    const f = (x, n) => +x.toFixed(n)
    function animate(params) {
        let delta = (num-now), sign = Math.sign(delta),
        d = f(delta / 3, 4);
        // console.log({num, now}, {n, sign, d})
        // if (n < .0005 || n > .9999) n = 0;
        num = d ? num + d * sign : now; 
        // if 
        transform(num)
        if (delta != 0) goSmooth()
    }

    function goSmooth(){
        // if (isScrolling) 
        // window.requestAnimationFrame(animate)
        dir = 0
        triggeredScroll = true;
        console.log("go smooth")
        // entry.target.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'})
        window.scrollTo({behavior: 'smooth',top:getScrollPos(now)})
        
    }
    const getNum =_=>window.scrollY/(scrollHeight/items.length);
    const getScrollPos =n=>(scrollHeight/items.length)*n;
    transform(getNum());

    let isScrolling = null, prevScroll=0, triggeredScroll = false;
    return {
        scrollHandler(e){
            window.clearTimeout( isScrolling );
            // console.log(e)
            let curNum = getNum()
            // Set a timeout to run after scrolling ends
            // if (triggeredScroll) triggeredScroll = false
            // else {
                dir = prevScroll - window.scrollY;
                // dir = curNum == now ? 0 : dir < 0 ? -1 : (dir == 0) ? 0 : 1 ;
                dir = curNum == now ? 0 : clamp(dir/4, -1, 1);
                isScrolling = setTimeout(goSmooth, 166);
            // } 
            transform(curNum);
            prevScroll = window.scrollY;
            
            // let num = window.scrollY/(1825/items.length);
            // items.forEach((e,i)=>{
            //     let n = num-i;
            //     e.style = `--z:${n};--o:${clamp(1+n,0,1)};--b:${clamp(n,0,1)};`
            // })
            // console.log(e,scrollOffset, window.pageYOffset, window.scrollY,window.scrollY/(1825/items.length))
        }
    }

}

window.addEventListener('scroll', scroll3d(document.querySelector('section.scroll-3d')).scrollHandler)

document.querySelectorAll('div.flex > span').forEach(e=>e.style = `background-color: hsl(${Math.random()*359},70%,60%);`)