const scroll3d = block => {
    const oldItems = block.querySelectorAll('section.scroll-3d > section.item'),
    drawer = block.querySelector('div.drawer > div'),
    scrollOffset = {max:0,min:0},
    items = [];
    console.dir(oldItems[0])
    console.dir(oldItems[4])

    let fragment = new DocumentFragment(), num=0, now=0;

    // Clamp number between two values with the following line:
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);


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
        num = window.scrollY/(1825/items.length)
        now = Math.round(num);
        items.forEach((e,i)=>{
            let n = num-i;
            e.style = `--z:${-n};--y:${n};
                --o:${clamp(n>0?1-n*.5:n+1,0,1)};
                --b:${clamp(n<0?-n*.5:n*n,0,1)};
                --n:${num};`
                // --s:${n>0.53?1+(Math.sin(n-.53))*.1 :1}`
        })
    }
    function animate(params) {
        
    }

    function goSmooth(){
        window.requestAnimationFrame(animate)
    }
    
    transform();

    let isScrolling = null;
    return {
        scrollHandler(e){
            window.clearTimeout( isScrolling );

            // Set a timeout to run after scrolling ends
            isScrolling = setTimeout(goSmooth, 66);
            transform();
            
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