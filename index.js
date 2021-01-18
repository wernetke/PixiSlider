import * as PIXI from 'pixi.js'

import t1 from "./img/activitesynchro.jpg";
import t2 from "./img/clubnatation.jpg";
import t3 from "./img/clubsauvetage.jpg";
import t4 from "./img/coursenfant.jpg";
import t5 from "./img/coursenfant2.jpg";
import gsap from 'gsap';

import fit from "math-fit"

function loadImages(paths, whenLoaded){
    const imgs= [];
    const img0 = []
    paths.forEach(function (path){
        const img = new Image();
        img.onload = function (){
            imgs.push(img);
            img0.push({path, img});
            if(imgs.length === paths.length) whenLoaded(img0);
        };
        img.src = path;
    });
}

class Sketch{
    constructor(){
        this.app = new PIXI.Application({ 
            backgroundColor: 0x1099bb,
            resizeTo: window
         });
        document.body.appendChild(this.app.view);
        this.margin = 50;
        this.scroll = 0;
        this.scrollTarget = 0;
        this.width=(window.innerWidth -2*this.margin)/3;
        this.height = window.innerHeight*0.8

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
        this.images = [t1, t2, t3, t4, t5];
        this.WHOLEWIDTH = this.images.length*(this.width + this.margin)

        loadImages(this.images, (images)=>{
            this.loadImages = images;
            this.add()
            this.render()
            this.scrollEvent();
        })

  
    }


    scrollEvent(){
        document.addEventListener('mousewheel', (e)=>{
            this.scrollTarget = e.wheelDelta/3
        })
    }

    add(){
        let parent = {
            w: this.width,
            h: this.height,
        }
        this.thumbs = []
        this.loadImages.forEach((img,i)=>{
            let texture = PIXI.Texture.from(img.img)
            const sprite = new PIXI.Sprite(texture);
            let container = new PIXI.Container();
            let spriteContainer = new PIXI.Container();

            let mask = new PIXI.Sprite(PIXI.Texture.WHITE)
            mask.width = this.width;
            mask.height = this.height;

            sprite.mask = mask;
            // sprite.width = 100;
            // sprite.height = 100;

            sprite.anchor.set(0.5);
            sprite.position.set(
                sprite.texture.orig.width/2,
                sprite.texture.orig.height/2,
            )

            let image = {
                w: sprite.texture.orig.width,
                h: sprite.texture.orig.height,
            }

            let cover = fit(image, parent)

            spriteContainer.position.set(cover.left, cover.top)
            spriteContainer.scale.set(cover.scale, cover.scale)

            container.x = (this.margin + this.width)*i;
            container.y = this.height/10

            spriteContainer.addChild(sprite);
            container.interactive = true;
            container.on('mouseover', this.mouseOn)
            container.on('mouseout', this.mouseOut)

            container.addChild(spriteContainer)
            container.addChild(mask);
            this.container.addChild(container);
            this.thumbs.push(container);


        })
    }

    mouseOut(e){

        let e1 = e.currentTarget.children[0].children[0];
        gsap.to(e1.scale,{
            duration:1,
            x:1,
            y:1
        })

    }

    calcPos(scr, pos){

        let temp = (scr + pos + this.WHOLEWIDTH + this.width + this.margin)%this.WHOLEWIDTH - this.width - this.margin

        return temp;

    }

    mouseOn(e){
        let e1 = e.target.children[0].children[0];
        gsap.to(e1.scale,{
            duration:1,
            x:1.1,
            y:1.1
        })
    }

    render(){
        this.app.ticker.add(() => {
            this.app.renderer.render(this.container);

            this.scroll -= (this.scroll - this.scrollTarget)*0.1;
            this.scroll *=0.9
            this.thumbs.forEach(th=>{
                th.position.x = this.calcPos(this.scroll, th.position.x)
            })
        });
    }


}

new Sketch();
